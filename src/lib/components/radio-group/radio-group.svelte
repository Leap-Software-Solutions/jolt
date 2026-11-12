<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type RadioGroupItem = {
		value: string;
		label: string;
		description?: string;
		icon?: Component<{ class?: string }>;
		disabled?: boolean;
	};

	export type RadioGroupOrientation = 'horizontal' | 'vertical';

	export type Props = {
		items: RadioGroupItem[];
		value?: string;
		onValueChange?: (value: string) => void;
		orientation?: RadioGroupOrientation;
		loop?: boolean;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
		name?: string;
		ariaLabel?: string;
		class?: string;
		itemClass?: string;
		controlClass?: string;
		labelClass?: string;
		descriptionClass?: string;
		item?: Snippet<[RadioGroupItem]>;
	};
</script>

<script lang="ts">
	import { RadioGroup as BitsRadioGroup } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const uid = $props.id();

	let {
		items,
		value = $bindable(''),
		onValueChange,
		orientation = 'vertical',
		loop,
		disabled,
		required,
		readonly,
		name,
		ariaLabel = 'Radio group',
		class: className,
		itemClass,
		controlClass,
		labelClass,
		descriptionClass,
		item: itemSnippet,
	}: Props = $props();

	function getItemId(index: number): string {
		return `${uid}-item-${index}`;
	}

	function getDescriptionId(index: number): string {
		return `${getItemId(index)}-description`;
	}

	const isHorizontal = $derived(orientation === 'horizontal');
</script>

<BitsRadioGroup.Root
	bind:value
	{onValueChange}
	{orientation}
	{loop}
	{disabled}
	{required}
	{readonly}
	{name}
	aria-label={ariaLabel}
	data-slot="radio-group"
	class={cls(
		'grid gap-2.5',
		isHorizontal && 'grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3',
		className,
	)}
>
	{#each items as item, index (item.value)}
		<div data-slot="radio-group-item" class={cls('flex items-start gap-2.5', itemClass)}>
			<BitsRadioGroup.Item
				id={getItemId(index)}
				value={item.value}
				disabled={item.disabled}
				aria-describedby={item.description ? getDescriptionId(index) : undefined}
				data-slot="radio-group-control"
				class={cls(
					'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background text-primary-foreground shadow-xs transition-[color,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
					'disabled:cursor-not-allowed disabled:opacity-50',
					'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
					controlClass,
				)}
			>
				{#snippet children({ checked })}
					{#if checked}
						<span class="size-2 rounded-full bg-primary-foreground"></span>
					{/if}
				{/snippet}
			</BitsRadioGroup.Item>

			<div class="flex min-w-0 flex-col gap-0.5">
				<label
					for={getItemId(index)}
					class={cls(
						'inline-flex items-center gap-1.5 text-sm leading-tight font-medium',
						item.disabled && 'cursor-not-allowed opacity-50',
						labelClass,
					)}
				>
					{#if itemSnippet}
						{@render itemSnippet(item)}
					{:else}
						{#if item.icon}
							{@const Icon = item.icon}
							<Icon class="size-4 text-muted-foreground" />
						{/if}
						{item.label}
					{/if}
				</label>
				{#if item.description}
					<span
						id={getDescriptionId(index)}
						class={cls('text-xs text-muted-foreground', descriptionClass)}
					>
						{item.description}
					</span>
				{/if}
			</div>
		</div>
	{/each}
</BitsRadioGroup.Root>
