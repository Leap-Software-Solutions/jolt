<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		value?: string;
		placeholder?: string;
		inputLabel?: string;
		disabled?: boolean;
		loading?: boolean;
		maxLength?: number;
		maxHeight?: number;
		sendLabel?: string;
		stopLabel?: string;
		onSend?: (value: string) => void;
		onStop?: () => void;
		onFiles?: (files: File[]) => void;
		toolbar?: Snippet;
		class?: string;
		textareaClass?: string;
	};
</script>

<script lang="ts">
	import { ArrowUpIcon, SquareIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		value = $bindable(''),
		placeholder = 'Message…',
		inputLabel = 'Message',
		disabled,
		loading,
		maxLength,
		maxHeight = 200,
		sendLabel = 'Send message',
		stopLabel = 'Stop generating',
		onSend,
		onStop,
		onFiles,
		toolbar,
		class: className,
		textareaClass,
	}: Props = $props();

	let textarea = $state<HTMLTextAreaElement | null>(null);
	let isComposing = $state(false);
	let isDragging = $state(false);

	const canSend = $derived(!disabled && !loading && value.trim().length > 0);

	function submit(): void {
		const text = value.trim();
		if (!text || disabled || loading) return;
		onSend?.(text);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key !== 'Enter' || event.shiftKey || isComposing) return;
		event.preventDefault();
		submit();
	}

	function handleDragOver(event: DragEvent): void {
		if (!onFiles) return;
		event.preventDefault();
		if (disabled) return;
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent): void {
		const nextTarget = event.relatedTarget;
		if (
			nextTarget instanceof Node &&
			event.currentTarget instanceof Node &&
			event.currentTarget.contains(nextTarget)
		) {
			return;
		}
		isDragging = false;
	}

	function handleDrop(event: DragEvent): void {
		if (!onFiles) return;
		event.preventDefault();
		isDragging = false;
		if (disabled) return;
		const files = Array.from(event.dataTransfer?.files ?? []);
		if (files.length === 0) return;
		onFiles(files);
		textarea?.focus();
	}

	$effect(() => {
		if (!textarea) return;
		if (textarea.value !== value) textarea.value = value;
		textarea.style.height = 'auto';
		textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
	});
</script>

<form
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	data-slot="chat-composer"
	data-dragging={isDragging || undefined}
	class={cls(
		'rounded-xl border border-input bg-background p-2 shadow-xs transition-[color,box-shadow,background-color] duration-150 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:transition-none',
		isDragging && 'border-brand bg-brand-subtle/20',
		className,
	)}
>
	<textarea
		bind:this={textarea}
		bind:value
		{placeholder}
		{disabled}
		maxlength={maxLength}
		aria-label={inputLabel}
		rows="1"
		data-slot="chat-composer-input"
		class={cls(
			'block min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			textareaClass,
		)}
		onkeydown={handleKeydown}
		oncompositionstart={() => (isComposing = true)}
		oncompositionend={() => (isComposing = false)}></textarea>

	<div class="flex items-end justify-between gap-2 px-1">
		<div class="flex min-w-0 items-center gap-1">
			{@render toolbar?.()}
		</div>

		{#if loading}
			<Button
				type="button"
				size="icon"
				class="size-8 shrink-0 rounded-full"
				aria-label={stopLabel}
				title={stopLabel}
				onclick={onStop}
			>
				<SquareIcon class="size-3.5 fill-current" />
			</Button>
		{:else}
			<Button
				type="submit"
				size="icon"
				class="size-8 shrink-0 rounded-full"
				aria-label={sendLabel}
				title={sendLabel}
				disabled={!canSend}
			>
				<ArrowUpIcon />
			</Button>
		{/if}
	</div>
</form>
