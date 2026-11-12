<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	export type Props = HTMLLabelAttributes & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let { class: className, children, ...restProps }: Props = $props();
</script>

<label
	data-slot="label"
	class={cls(
		'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</label>
