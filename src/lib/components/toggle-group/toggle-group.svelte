<script lang="ts" module>
	import type { Component } from 'svelte';

	export type ToggleGroupItem = {
		value: string;
		label?: string;
		ariaLabel?: string;
		icon?: Component<{ class?: string }>;
		disabled?: boolean;
	};

	export type ToggleGroupType = 'single' | 'multiple';
	export type ToggleGroupVariant = 'default' | 'outline';
	export type ToggleGroupSize = 'sm' | 'default' | 'lg';
	export type ToggleGroupOrientation = 'horizontal' | 'vertical';

	export type Props = {
		items: ToggleGroupItem[];
		type?: ToggleGroupType;
		value?: string | string[];
		onValueChange?: (value: string | string[]) => void;
		variant?: ToggleGroupVariant;
		size?: ToggleGroupSize;
		orientation?: ToggleGroupOrientation;
		loop?: boolean;
		rovingFocus?: boolean;
		disabled?: boolean;
		ariaLabel?: string;
		class?: string;
		itemClass?: string;
	};
</script>

<script lang="ts">
	import { ToggleGroup as BitsToggleGroup } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { toggleVariants } from '../toggle/toggle-variants.js';

	let {
		items,
		type = 'single',
		value = $bindable(),
		onValueChange,
		variant = 'default',
		size = 'default',
		orientation = 'horizontal',
		loop,
		rovingFocus,
		disabled,
		ariaLabel = 'Toggle group',
		class: className,
		itemClass,
	}: Props = $props();

	const isVertical = $derived(orientation === 'vertical');
	const isOutline = $derived(variant === 'outline');
	const segmentedItemHeights: Record<ToggleGroupSize, string> = {
		sm: 'h-6',
		default: 'h-7',
		lg: 'h-8',
	};

	const singleValue = $derived(typeof value === 'string' ? value : '');
	const multipleValue = $derived(Array.isArray(value) ? value : []);

	function handleSingleValueChange(next: string): void {
		value = next;
		onValueChange?.(next);
	}

	function handleMultipleValueChange(next: string[]): void {
		value = next;
		onValueChange?.(next);
	}

	const itemClasses = $derived(
		cls(
			toggleVariants({ variant: 'default', size }),
			!isOutline && segmentedItemHeights[size],
			isOutline &&
				'rounded-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-inset focus-visible:ring-offset-0',
			!isOutline && 'hover:bg-background/70 hover:text-foreground',
			isVertical && 'w-full',
			itemClass,
		),
	);

	const rootClasses = $derived(
		cls(
			'inline-flex items-stretch',
			isOutline
				? 'overflow-hidden rounded-lg bg-background ring-1 ring-input'
				: 'gap-1 rounded-lg bg-muted p-1',
			isOutline && isVertical && 'flex-col divide-y divide-input',
			isOutline && !isVertical && 'flex-row divide-x divide-input',
			!isOutline && isVertical && 'flex-col',
			!isOutline && !isVertical && 'flex-row',
			className,
		),
	);
</script>

{#snippet itemContent(item: ToggleGroupItem)}
	{#if item.icon}
		{@const Icon = item.icon}
		<Icon class="size-4" />
	{/if}
	{#if item.label}
		<span>{item.label}</span>
	{/if}
{/snippet}

{#if type === 'multiple'}
	<BitsToggleGroup.Root
		type="multiple"
		value={multipleValue}
		onValueChange={handleMultipleValueChange}
		{orientation}
		{loop}
		{rovingFocus}
		{disabled}
		aria-label={ariaLabel}
		data-slot="toggle-group"
		class={rootClasses}
	>
		{#each items as item (item.value)}
			<BitsToggleGroup.Item
				value={item.value}
				disabled={item.disabled}
				aria-label={!item.label ? (item.ariaLabel ?? item.value) : undefined}
				data-slot="toggle-group-item"
				class={itemClasses}
			>
				{@render itemContent(item)}
			</BitsToggleGroup.Item>
		{/each}
	</BitsToggleGroup.Root>
{:else}
	<BitsToggleGroup.Root
		type="single"
		value={singleValue}
		onValueChange={handleSingleValueChange}
		{orientation}
		{loop}
		{rovingFocus}
		{disabled}
		aria-label={ariaLabel}
		data-slot="toggle-group"
		class={rootClasses}
	>
		{#each items as item (item.value)}
			<BitsToggleGroup.Item
				value={item.value}
				disabled={item.disabled}
				aria-label={!item.label ? (item.ariaLabel ?? item.value) : undefined}
				data-slot="toggle-group-item"
				class={itemClasses}
			>
				{@render itemContent(item)}
			</BitsToggleGroup.Item>
		{/each}
	</BitsToggleGroup.Root>
{/if}
