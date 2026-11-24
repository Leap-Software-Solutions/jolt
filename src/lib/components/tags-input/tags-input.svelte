<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { splitTags } from './parse.js';
	import type { Props } from './types.js';

	let {
		value = $bindable([]),
		onValueChange,
		placeholder = 'Add a tag...',
		ariaLabel,
		id,
		describedBy,
		invalid = false,
		disabled = false,
		maxTags,
		validate,
		normalize = (tag: string): string => tag.trim(),
		separators = [',', ';'],
		commitOnBlur = true,
		allowDuplicates = false,
		onInvalid,
		class: className,
		inputClass,
		chipClass,
	}: Props = $props();

	let inputValue = $state('');
	let inputElement = $state<HTMLInputElement | null>(null);
	let announcement = $state('');
	let announceTimer: ReturnType<typeof setTimeout> | undefined;

	const atLimit = $derived(maxTags !== undefined && value.length >= maxTags);
	const isInputDisabled = $derived(disabled || atLimit);
	const inputPlaceholder = $derived(value.length === 0 && !atLimit ? placeholder : '');

	$effect(() => {
		return () => {
			if (announceTimer) clearTimeout(announceTimer);
		};
	});

	function announce(message: string): void {
		announcement = message;
		if (announceTimer) clearTimeout(announceTimer);
		announceTimer = setTimeout(() => {
			announcement = '';
			announceTimer = undefined;
		}, 1800);
	}

	function addTag(raw: string): boolean {
		const next = normalize(raw);
		if (!next) return false;

		if (atLimit) {
			onInvalid?.(next, 'limit');
			return false;
		}

		if (validate && !validate(next)) {
			onInvalid?.(next, 'invalid');
			return false;
		}

		if (!allowDuplicates && value.some((tag) => normalize(tag) === next)) {
			onInvalid?.(next, 'duplicate');
			return false;
		}

		value = [...value, next];
		onValueChange?.(value);
		announce(`Added ${next}.`);
		return true;
	}

	function commitInput(): void {
		if (addTag(inputValue)) inputValue = '';
	}

	function removeTag(index: number): void {
		const removed = value[index];
		if (removed === undefined) return;

		const next = value.filter((_, itemIndex) => itemIndex !== index);
		value = next;
		onValueChange?.(next);
		announce(`Removed ${removed}.`);
		inputElement?.focus();
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.isComposing) return;

		if (event.key === 'Enter' || separators.includes(event.key)) {
			event.preventDefault();
			commitInput();
			return;
		}

		if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
			event.preventDefault();
			removeTag(value.length - 1);
		}
	}

	function handlePaste(event: ClipboardEvent): void {
		const pasted = event.clipboardData?.getData('text/plain');
		if (!pasted) return;

		const parts = splitTags(pasted, separators);
		if (parts.length <= 1) return;

		event.preventDefault();
		let added = false;

		for (const part of parts) {
			if (addTag(part)) added = true;
		}

		if (added) inputValue = '';
	}

	function handleBlur(): void {
		if (commitOnBlur) commitInput();
	}
</script>

<div
	data-slot="tags-input"
	class={cls(
		'relative flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
		'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
		invalid && 'border-destructive focus-within:ring-destructive',
		disabled && 'cursor-not-allowed bg-muted/30',
		className,
	)}
>
	{#each value as tag, index (`${tag}-${index}`)}
		<span
			data-slot="tags-input-chip"
			class={cls(
				'inline-flex max-w-full items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground',
				chipClass,
			)}
		>
			<span class="truncate">{tag}</span>
			<button
				type="button"
				data-slot="tags-input-remove"
				aria-label={`Remove ${tag}`}
				class="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none"
				{disabled}
				onclick={() => removeTag(index)}
			>
				<XIcon class="size-3" />
			</button>
		</span>
	{/each}

	<input
		bind:this={inputElement}
		bind:value={inputValue}
		{id}
		data-slot="tags-input-input"
		aria-label={ariaLabel ?? placeholder}
		aria-describedby={describedBy}
		aria-invalid={invalid || undefined}
		disabled={isInputDisabled}
		placeholder={inputPlaceholder}
		onkeydown={handleKeydown}
		onpaste={handlePaste}
		onblur={handleBlur}
		class={cls(
			'min-w-20 flex-1 border-0 bg-transparent p-0 text-sm shadow-none outline-hidden placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed',
			inputClass,
		)}
	/>

	<span class="sr-only" role="status" aria-live="polite">{announcement}</span>
</div>
