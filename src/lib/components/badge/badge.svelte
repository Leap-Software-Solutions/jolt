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
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
	export type BadgeIcon = Component<{ class?: string }>;

	export type Props = {
		label: string;
		icon?: BadgeIcon;
		iconClass?: string;
		variant?: BadgeVariant;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let { class: className, label, icon, iconClass, variant = 'default' }: Props = $props();
</script>

<span data-slot="badge" class={cls(badgeVariants({ variant }), className)}>
	{#if icon}
		{@const Icon = icon}
		<Icon class={cls('size-3', iconClass)} />
	{/if}
	{label}
</span>
