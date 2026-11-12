<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../types/index.js';

	export type Props = WithElementRef<Omit<HTMLInputAttributes, 'value'>> & {
		value?: string | number;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		class: className,
		value = $bindable(''),
		ref = $bindable(null),
		type = 'text',
		...restProps
	}: Props = $props();
</script>

<input
	bind:this={ref}
	bind:value
	{type}
	data-slot="input"
	class={cls(
		'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
		'placeholder:text-muted-foreground',
		'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive',
		className,
	)}
	{...restProps}
/>
