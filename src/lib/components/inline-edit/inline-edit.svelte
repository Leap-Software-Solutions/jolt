<script lang="ts" module>
	export type Props = {
		value?: string;
		editing?: boolean;
		placeholder: string;
		ariaLabel: string;
		multiline?: boolean;
		disabled?: boolean;
		editLabel?: string;
		saveLabel?: string;
		cancelLabel?: string;
		class?: string;
		inputClass?: string;
		onValueChange?: (value: string) => void;
	};
</script>

<script lang="ts">
	import { CheckIcon, XIcon } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		value = $bindable(''),
		editing = $bindable(false),
		placeholder,
		ariaLabel,
		multiline = false,
		disabled = false,
		editLabel = 'Edit',
		saveLabel = 'Save',
		cancelLabel = 'Cancel',
		class: className,
		inputClass,
		onValueChange,
	}: Props = $props();

	let displayButton = $state<HTMLButtonElement>();
	let editorRoot = $state<HTMLDivElement>();
	let inputElement = $state<HTMLInputElement | HTMLTextAreaElement>();
	let draft = $state('');
	let wasEditing = false;
	let cancelRequested = false;

	const displayValue = $derived(value || placeholder);
	const fieldClasses = $derived(
		cls(
			'w-full min-h-9 rounded-md border bg-background px-2.5 py-1.5 pe-16 text-sm leading-5 shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
			'placeholder:text-muted-foreground',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			'disabled:cursor-not-allowed disabled:opacity-50',
			inputClass,
		),
	);

	$effect(() => {
		const isEditing = editing;
		if (isEditing === wasEditing) return;

		wasEditing = isEditing;
		draft = value;

		if (!isEditing) return;

		cancelRequested = false;
		void tick().then(() => {
			inputElement?.focus();
			inputElement?.select();
		});
	});

	$effect(() => {
		if (!disabled || !editing) return;
		editing = false;
		draft = value;
	});

	function beginEdit(): void {
		if (disabled) return;
		editing = true;
	}

	function commit(restoreFocus = true): void {
		if (!editing) return;

		const next = draft.trim();
		const changed = next !== value;

		value = next;
		editing = false;

		if (changed) onValueChange?.(next);
		if (restoreFocus) {
			void tick().then(() => displayButton?.focus());
		}
	}

	function cancel(): void {
		if (!editing) return;

		cancelRequested = true;
		draft = value;
		editing = false;
		void tick().then(() => displayButton?.focus());
	}

	function handleFocusOut(event: FocusEvent): void {
		if (!editing || cancelRequested) return;

		const next = event.relatedTarget;
		if (next instanceof Node && editorRoot?.contains(next)) return;

		commit(false);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.isComposing) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			cancel();
			return;
		}

		if (event.key !== 'Enter') return;
		if (multiline && !event.metaKey && !event.ctrlKey) return;

		event.preventDefault();
		commit();
	}
</script>

<div data-slot="inline-edit" class={cls('w-full', className)}>
	{#if editing}
		<div
			bind:this={editorRoot}
			data-slot="inline-edit-editor"
			class="relative"
			onfocusout={handleFocusOut}
		>
			{#if multiline}
				<textarea
					bind:this={inputElement}
					bind:value={draft}
					{placeholder}
					{disabled}
					rows={1}
					data-slot="inline-edit-input"
					class={cls(fieldClasses, 'block [field-sizing:content] resize-none border-input')}
					aria-label={ariaLabel}
					onkeydown={handleKeydown}></textarea>
			{:else}
				<input
					bind:this={inputElement}
					bind:value={draft}
					type="text"
					{placeholder}
					{disabled}
					data-slot="inline-edit-input"
					class={cls(fieldClasses, 'block border-input')}
					aria-label={ariaLabel}
					onkeydown={handleKeydown}
				/>
			{/if}
			<div data-slot="inline-edit-actions" class="absolute end-1 top-1 flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon"
					class="size-7"
					aria-label={saveLabel}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => commit()}
				>
					<CheckIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="size-7"
					aria-label={cancelLabel}
					onmousedown={(event) => event.preventDefault()}
					onclick={cancel}
				>
					<XIcon />
				</Button>
			</div>
		</div>
	{:else}
		<button
			bind:this={displayButton}
			type="button"
			data-slot="inline-edit-display"
			class={cls(
				'block min-h-9 w-full rounded-md border border-transparent bg-transparent px-2.5 py-1.5 pe-16 text-start text-sm leading-5 break-words whitespace-pre-wrap transition-[color,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
				'hover:border-input hover:bg-background hover:shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
				'disabled:cursor-not-allowed disabled:opacity-50',
				value ? 'text-foreground' : 'text-muted-foreground',
			)}
			aria-label={`${editLabel}: ${displayValue}`}
			{disabled}
			onclick={beginEdit}
		>
			{displayValue}
		</button>
	{/if}
</div>
