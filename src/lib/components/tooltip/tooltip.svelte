<script lang="ts" module>
	import { Tooltip as BitsTooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
	export type TooltipAlign = 'start' | 'center' | 'end';
	export type TooltipTriggerProps = Record<string, unknown>;

	export type Props = {
		text?: string;
		trigger: Snippet<[TooltipTriggerProps]>;
		content?: Snippet;
		side?: TooltipSide;
		align?: TooltipAlign;
		sideOffset?: number;
		delay?: number;
		disableHoverableContent?: boolean;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		text,
		trigger,
		content,
		side = 'top',
		align = 'center',
		sideOffset = 6,
		delay = 300,
		disableHoverableContent = false,
		contentClass,
	}: Props = $props();
</script>

<BitsTooltip.Provider delayDuration={delay} {disableHoverableContent}>
	<BitsTooltip.Root>
		<BitsTooltip.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsTooltip.Trigger>
		<BitsTooltip.Portal>
			<BitsTooltip.Content
				{side}
				{align}
				{sideOffset}
				data-slot="tooltip-content"
				class={cls(
					'z-50 w-fit max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground shadow-md',
					'origin-(--bits-tooltip-content-transform-origin) animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
					contentClass,
				)}
			>
				{#if content}
					{@render content()}
				{:else}
					{text}
				{/if}
			</BitsTooltip.Content>
		</BitsTooltip.Portal>
	</BitsTooltip.Root>
</BitsTooltip.Provider>
