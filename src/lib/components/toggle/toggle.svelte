<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type {
		ToggleSize as ToggleSizeValue,
		ToggleVariant as ToggleVariantValue,
	} from './toggle-variants.js';

	export type { ToggleSize, ToggleVariant } from './toggle-variants.js';

	export type Props = {
		pressed?: boolean;
		onPressedChange?: (pressed: boolean) => void;
		variant?: ToggleVariantValue;
		size?: ToggleSizeValue;
		disabled?: boolean;
		ariaLabel?: string;
		type?: 'button' | 'submit' | 'reset';
		children?: Snippet;
		class?: string;
		/** Attributes supplied by a tooltip trigger and forwarded to the button. */
		triggerProps?: Record<string, unknown>;
	};
</script>

<script lang="ts">
	import { Toggle as BitsToggle } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { toggleVariants } from './toggle-variants.js';

	let {
		pressed = $bindable(false),
		onPressedChange,
		variant = 'default',
		size = 'default',
		disabled,
		ariaLabel,
		type = 'button',
		children,
		class: className,
		triggerProps,
	}: Props = $props();

	const classes = $derived(cls(toggleVariants({ variant, size }), className));
</script>

<BitsToggle.Root
	{...triggerProps}
	{pressed}
	{onPressedChange}
	{disabled}
	{type}
	aria-label={ariaLabel}
	data-slot="toggle"
	class={classes}
>
	{@render children?.()}
</BitsToggle.Root>
