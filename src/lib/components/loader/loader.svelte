<script lang="ts" module>
	export type LoaderSize = 'sm' | 'default' | 'lg';

	export type Props = {
		size?: LoaderSize;
		label?: string;
		decorative?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	const sizeClasses: Record<LoaderSize, string> = {
		sm: 'size-1.5',
		default: 'size-2',
		lg: 'size-2.5',
	};

	const gapClasses: Record<LoaderSize, string> = {
		sm: 'gap-0.5',
		default: 'gap-1',
		lg: 'gap-1',
	};

	let {
		size = 'default',
		label = 'Loading',
		decorative = false,
		class: className,
	}: Props = $props();
</script>

<span
	role={decorative ? undefined : 'status'}
	aria-label={decorative ? undefined : label}
	aria-hidden={decorative || undefined}
	data-slot="loader"
	class={cls('inline-flex items-center', gapClasses[size], className)}
>
	{#each [0, 1, 2] as index (index)}
		<span
			aria-hidden="true"
			class={cls('jolt-loader-dot rounded-full bg-muted-foreground', sizeClasses[size])}
			style="animation-delay: {index * 150}ms"
		></span>
	{/each}
	{#if !decorative}
		<span class="sr-only">{label}</span>
	{/if}
</span>

<style>
	@keyframes jolt-loader-dot {
		0%,
		60%,
		100% {
			transform: translateY(0);
			opacity: 0.45;
		}

		30% {
			transform: translateY(-0.2rem);
			opacity: 1;
		}
	}

	.jolt-loader-dot {
		animation: jolt-loader-dot 1.1s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.jolt-loader-dot {
			animation: none;
		}
	}
</style>
