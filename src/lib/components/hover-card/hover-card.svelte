<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type HoverCardTriggerProps = Record<string, unknown>;
	export type HoverCardSide = 'top' | 'right' | 'bottom' | 'left';
	export type HoverCardAlign = 'start' | 'center' | 'end';

	export type Props = {
		trigger: Snippet<[HoverCardTriggerProps]>;
		children?: Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		openDelay?: number;
		closeDelay?: number;
		disabled?: boolean;
		side?: HoverCardSide;
		align?: HoverCardAlign;
		sideOffset?: number;
		class?: string;
	};
</script>

<script lang="ts">
	import { LinkPreview as BitsLinkPreview } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		trigger,
		children,
		open = $bindable(false),
		onOpenChange,
		openDelay = 700,
		closeDelay = 300,
		disabled,
		side = 'bottom',
		align = 'center',
		sideOffset = 6,
		class: className,
	}: Props = $props();
</script>

<BitsLinkPreview.Root bind:open {onOpenChange} {openDelay} {closeDelay} {disabled}>
	<BitsLinkPreview.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</BitsLinkPreview.Trigger>

	<BitsLinkPreview.Portal>
		<BitsLinkPreview.Content
			{side}
			{align}
			{sideOffset}
			data-slot="hover-card-content"
			class={cls(
				'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className,
			)}
		>
			{@render children?.()}
		</BitsLinkPreview.Content>
	</BitsLinkPreview.Portal>
</BitsLinkPreview.Root>
