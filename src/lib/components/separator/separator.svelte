<script lang="ts" module>
	export type Props = {
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { Separator as BitsSeparator } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let { class: className, orientation = 'horizontal', decorative }: Props = $props();
</script>

<BitsSeparator.Root
	{orientation}
	{decorative}
	data-slot="separator"
	class={cls(
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className,
	)}
/>
