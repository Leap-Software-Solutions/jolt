<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'relative w-full rounded-lg border p-4',
		variants: {
			variant: {
				default: 'border-foreground/20 bg-background text-foreground',
				destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
				brand: 'border-brand/40 bg-brand/10 text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];

	export type Props = {
		title?: string;
		description?: string;
		variant?: AlertVariant;
		icon?: Component<{ class?: string }>;
		iconClass?: string;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		title,
		description,
		variant = 'default',
		icon,
		iconClass,
		children,
		class: className,
	}: Props = $props();

	const isDestructive = $derived(variant === 'destructive');
	const isBrand = $derived(variant === 'brand');
</script>

<div role="alert" data-slot="alert" class={cls(alertVariants({ variant }), className)}>
	<div class="flex gap-3">
		{#if icon}
			{@const Icon = icon}
			<Icon
				class={cls(
					'mt-0.5 size-4 shrink-0',
					isDestructive ? 'text-destructive' : 'text-brand-strong',
					iconClass,
				)}
			/>
		{/if}
		<div class="flex min-w-0 flex-1 flex-col gap-1">
			{#if title}
				<h5 class={cls('text-sm leading-none font-medium', isBrand && 'text-brand-strong')}>
					{title}
				</h5>
			{/if}
			{#if description}
				<p class={cls('text-sm', isDestructive ? 'text-destructive/90' : 'text-muted-foreground')}>
					{description}
				</p>
			{/if}
			{@render children?.()}
		</div>
	</div>
</div>
