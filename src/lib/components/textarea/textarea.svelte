<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../types/index.js';

	export type Props = WithElementRef<Omit<HTMLTextareaAttributes, 'value'>> & {
		value?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		class: className,
		value = $bindable(''),
		ref = $bindable(null),
		rows = 3,
		...restProps
	}: Props = $props();
</script>

<textarea
	bind:this={ref}
	bind:value
	{rows}
	data-slot="textarea"
	class={cls(
		'flex min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
		'placeholder:text-muted-foreground',
		'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive',
		className,
	)}
	{...restProps}></textarea>
