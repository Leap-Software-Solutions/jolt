<script lang="ts" module>
	import type { Component } from 'svelte';
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden',
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				outline: 'border-foreground/20 text-foreground',
				brand: 'border-transparent bg-brand text-brand-foreground',
				destructive: 'border-transparent bg-destructive text-destructive-foreground',
				neutral: 'border-border bg-muted text-muted-foreground',
				info: 'border-info/20 bg-info/10 text-info',
				success: 'border-success/20 bg-success/10 text-success',
				warning: 'border-warning/20 bg-warning/10 text-warning',
				danger: 'border-destructive/20 bg-destructive/10 text-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
	export type BadgeIcon = Component<{ class?: string }>;

	export type BadgeBase = {
		icon?: BadgeIcon;
		iconClass?: string;
		variant?: BadgeVariant;
		dot?: boolean;
		class?: string;
	};

	export type Props = BadgeBase &
		(
			| { label: string; count?: never; maxCount?: never }
			| { count: number; maxCount?: number; label?: never }
		);
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	function formatCount(value: number, limit: number): string {
		return value > limit ? `${limit}+` : String(value);
	}

	let {
		class: className,
		label,
		count,
		icon,
		iconClass,
		variant = 'default',
		dot = false,
		maxCount = 99,
	}: Props = $props();

	const isCount = $derived(typeof count === 'number');
	const countLabel = $derived(typeof count === 'number' ? formatCount(count, maxCount) : label);
</script>

<span
	data-slot="badge"
	data-variant={variant}
	class={cls(
		badgeVariants({ variant }),
		isCount && 'min-w-5 justify-center px-1.5 tabular-nums',
		className,
	)}
>
	{#if dot}
		<span data-slot="badge-dot" aria-hidden="true" class="size-1.5 rounded-full bg-current"></span>
	{/if}
	{#if icon}
		{@const Icon = icon}
		<Icon class={cls('size-3', iconClass)} />
	{/if}
	{isCount ? countLabel : label}
</span>
