<script lang="ts" module>
	export type Props = {
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let { class: className }: Props = $props();
</script>

<div
	aria-hidden="true"
	data-slot="skeleton"
	class={cls('animate-pulse rounded-md bg-foreground/15 dark:bg-foreground/20', className)}
></div>
