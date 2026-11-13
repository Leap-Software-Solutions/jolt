<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		children?: Snippet;
		ariaLabel?: string;
		autoScroll?: boolean;
		stickToBottomThreshold?: number;
		class?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		children,
		ariaLabel,
		autoScroll = true,
		stickToBottomThreshold = 24,
		class: className,
		contentClass,
	}: Props = $props();

	let viewport = $state<HTMLDivElement | null>(null);
	let content = $state<HTMLDivElement | null>(null);
	let isPinned = $state(true);
	let hasOverflow = $state(false);

	const showScrollButton = $derived(hasOverflow && !isPinned);

	function updateOverflow(): void {
		if (!viewport) return;
		hasOverflow = viewport.scrollHeight > viewport.clientHeight + 1;
	}

	export function scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
		if (!viewport) return;
		viewport.scrollTo({ top: viewport.scrollHeight, behavior });
		isPinned = true;
	}

	function handleScroll(): void {
		if (!viewport) return;
		const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
		isPinned = distance <= stickToBottomThreshold;
		updateOverflow();
	}

	$effect(() => {
		if (!viewport || !content) return;
		const observer = new ResizeObserver(() => {
			updateOverflow();
			if (autoScroll && isPinned) scrollToBottom('auto');
		});
		observer.observe(content);
		updateOverflow();
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!autoScroll || !viewport || !content) return;
		const frame = requestAnimationFrame(() => scrollToBottom('auto'));
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	data-slot="chat-viewport"
	style:height="100%"
	class={cls('relative min-h-0 overflow-hidden', className)}
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={viewport}
		role="log"
		tabindex="0"
		aria-label={ariaLabel}
		aria-live="polite"
		onscroll={handleScroll}
		data-slot="chat-viewport-scroll"
		style:height="100%"
		style:overflow-y="auto"
		class={cls('overscroll-contain', contentClass)}
	>
		<div bind:this={content}>
			{@render children?.()}
		</div>
	</div>

	{#if showScrollButton}
		<Button
			variant="secondary"
			size="icon"
			aria-label="Scroll to latest message"
			class="absolute bottom-3 left-1/2 size-8 -translate-x-1/2 rounded-full shadow-md"
			onclick={() => scrollToBottom()}
		>
			<ChevronDownIcon />
		</Button>
	{/if}
</div>
