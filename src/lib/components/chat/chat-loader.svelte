<script lang="ts" module>
	export type Props = {
		label?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Loader } from '../loader/index.js';

	let { label = 'Thinking', class: className }: Props = $props();
</script>

<span
	role="status"
	aria-label={label}
	data-slot="chat-loader"
	class={cls('inline-flex items-center gap-2', className)}
>
	<Loader size="sm" decorative />
	<span aria-hidden="true" class="text-xs text-muted-foreground">{label}</span>
</span>
