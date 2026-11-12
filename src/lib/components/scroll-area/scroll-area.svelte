<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
	export type ScrollAreaType = 'hover' | 'scroll' | 'auto' | 'always';

	export type Props = {
		orientation?: ScrollAreaOrientation;
		type?: ScrollAreaType;
		class?: string;
		viewportClass?: string;
		scrollbarClass?: string;
		thumbClass?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { ScrollArea as BitsScrollArea } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		orientation = 'vertical',
		type = 'hover',
		class: className,
		viewportClass,
		scrollbarClass,
		thumbClass,
		children,
	}: Props = $props();

	const showVertical = $derived(orientation === 'vertical' || orientation === 'both');
	const showHorizontal = $derived(orientation === 'horizontal' || orientation === 'both');
</script>

<BitsScrollArea.Root
	{type}
	data-slot="scroll-area"
	class={cls('relative overflow-hidden', className)}
>
	<BitsScrollArea.Viewport
		tabindex={0}
		data-slot="scroll-area-viewport"
		class={cls('size-full rounded-[inherit]', viewportClass)}
	>
		{@render children?.()}
	</BitsScrollArea.Viewport>

	{#if showVertical}
		<BitsScrollArea.Scrollbar
			orientation="vertical"
			data-slot="scroll-area-scrollbar"
			class={cls('flex w-2.5 touch-none p-px transition-colors select-none', scrollbarClass)}
		>
			<BitsScrollArea.Thumb
				data-slot="scroll-area-thumb"
				class={cls('relative flex-1 rounded-full bg-border', thumbClass)}
			/>
		</BitsScrollArea.Scrollbar>
	{/if}

	{#if showHorizontal}
		<BitsScrollArea.Scrollbar
			orientation="horizontal"
			data-slot="scroll-area-scrollbar"
			class={cls(
				'flex h-2.5 touch-none flex-col p-px transition-colors select-none',
				scrollbarClass,
			)}
		>
			<BitsScrollArea.Thumb
				data-slot="scroll-area-thumb"
				class={cls('relative flex-1 rounded-full bg-border', thumbClass)}
			/>
		</BitsScrollArea.Scrollbar>
	{/if}

	{#if orientation === 'both'}
		<BitsScrollArea.Corner />
	{/if}
</BitsScrollArea.Root>
