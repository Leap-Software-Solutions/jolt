<script lang="ts" module>
	export type SpinnerSize = 'sm' | 'default' | 'lg';

	export type Props = {
		size?: SpinnerSize;
		label?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	const sizeClasses: Record<SpinnerSize, string> = {
		sm: 'size-3',
		default: 'size-4',
		lg: 'size-6',
	};

	let { size = 'default', label = 'Loading', class: className }: Props = $props();
</script>

<span
	role="status"
	aria-label={label}
	data-slot="spinner"
	class={cls(
		'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none',
		sizeClasses[size],
		className,
	)}
></span>
