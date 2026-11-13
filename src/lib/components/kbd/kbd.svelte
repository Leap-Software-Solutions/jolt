<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type KbdSize = 'sm' | 'default';

	export type Props = {
		size?: KbdSize;
		class?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	const sizeClasses: Record<KbdSize, string> = {
		sm: 'h-4 min-w-4 px-1 text-[10px]',
		default: 'h-5 min-w-5 px-1.5 text-[11px]',
	};

	let { size = 'default', class: className, children }: Props = $props();
</script>

<kbd
	data-slot="kbd"
	class={cls(
		'inline-flex items-center justify-center rounded border border-border bg-muted font-mono font-medium text-muted-foreground shadow-xs',
		sizeClasses[size],
		className,
	)}
>
	{@render children?.()}
</kbd>
