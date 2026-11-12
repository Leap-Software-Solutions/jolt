<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PopoverTriggerProps = Record<string, unknown>;
	export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
	export type PopoverAlign = 'start' | 'center' | 'end';

	export type Props = {
		trigger: Snippet<[PopoverTriggerProps]>;
		children?: Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		side?: PopoverSide;
		align?: PopoverAlign;
		sideOffset?: number;
		alignOffset?: number;
		trapFocus?: boolean;
		class?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { Popover as BitsPopover } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		trigger,
		children,
		open = $bindable(false),
		onOpenChange,
		side = 'bottom',
		align = 'center',
		sideOffset = 6,
		alignOffset,
		trapFocus = false,
		class: className,
		contentClass,
	}: Props = $props();
</script>

<BitsPopover.Root bind:open {onOpenChange}>
	<BitsPopover.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</BitsPopover.Trigger>

	<BitsPopover.Portal>
		<BitsPopover.Content
			{side}
			{align}
			{sideOffset}
			{alignOffset}
			{trapFocus}
			data-slot="popover-content"
			class={cls(
				'z-50 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md',
				'origin-(--bits-popover-content-transform-origin) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className,
				contentClass,
			)}
		>
			{@render children?.()}
		</BitsPopover.Content>
	</BitsPopover.Portal>
</BitsPopover.Root>
