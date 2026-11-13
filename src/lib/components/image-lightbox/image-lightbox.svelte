<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon, XIcon } from '@lucide/svelte';
	import { Dialog as BitsDialog } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	let {
		images,
		open = $bindable(false),
		index = $bindable(0),
		ariaLabel = 'Image preview',
		trigger,
		onOpenChange,
		onIndexChange,
		class: className,
	}: Props = $props();

	const current = $derived(images[index] ?? images[0]);
	const hasNavigation = $derived(images.length > 1);

	$effect(() => {
		if (images.length === 0) {
			index = 0;
			return;
		}
		if (index < 0 || index >= images.length) index = 0;
	});

	function setIndex(next: number): void {
		if (images.length === 0) return;
		const normalized = ((next % images.length) + images.length) % images.length;
		index = normalized;
		onIndexChange?.(normalized);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (!hasNavigation) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setIndex(index - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			setIndex(index + 1);
		}
	}
</script>

<BitsDialog.Root bind:open {onOpenChange}>
	{#if trigger}
		<BitsDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsDialog.Trigger>
	{/if}
	<BitsDialog.Portal>
		<BitsDialog.Overlay
			data-slot="image-lightbox-overlay"
			class="fixed inset-0 z-50 bg-black/90 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsDialog.Content
			data-slot="image-lightbox"
			class={cls(
				'fixed inset-0 z-50 flex flex-col text-white outline-none',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
				className,
			)}
			onkeydown={handleKeydown}
		>
			<BitsDialog.Title class="sr-only">{ariaLabel}</BitsDialog.Title>

			<div class="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
				<span class="text-xs text-white/70">
					{#if current}
						{index + 1} / {images.length}
					{/if}
				</span>
				<BitsDialog.Close
					type="button"
					aria-label="Close image preview"
					class="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
				>
					<XIcon class="size-5" />
				</BitsDialog.Close>
			</div>

			<div class="relative flex min-h-0 flex-1 items-center justify-center px-4 py-2">
				{#if hasNavigation}
					<button
						type="button"
						aria-label="Previous image"
						class="absolute left-4 z-10 rounded-full bg-black/40 p-2 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
						onclick={() => setIndex(index - 1)}
					>
						<ChevronLeftIcon class="size-6" />
					</button>
				{/if}

				{#if current}
					<img
						data-slot="image-lightbox-image"
						src={current.src}
						alt={current.alt}
						class="max-h-full max-w-full object-contain"
					/>
				{/if}

				{#if hasNavigation}
					<button
						type="button"
						aria-label="Next image"
						class="absolute right-4 z-10 rounded-full bg-black/40 p-2 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
						onclick={() => setIndex(index + 1)}
					>
						<ChevronRightIcon class="size-6" />
					</button>
				{/if}
			</div>

			{#if current?.caption}
				<p class="shrink-0 px-4 pb-4 text-center text-sm text-white/70">{current.caption}</p>
			{/if}
		</BitsDialog.Content>
	</BitsDialog.Portal>
</BitsDialog.Root>
