<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type TabsItem = {
		value: string;
		label: string;
		icon?: Component<{ class?: string }>;
		disabled?: boolean;
	};

	export type TabsOrientation = 'horizontal' | 'vertical';
	export type TabsActivationMode = 'automatic' | 'manual';

	export type Props = {
		items: TabsItem[];
		value?: string;
		onValueChange?: (value: string) => void;
		orientation?: TabsOrientation;
		activationMode?: TabsActivationMode;
		loop?: boolean;
		disabled?: boolean;
		ariaLabel?: string;
		class?: string;
		listClass?: string;
		triggerClass?: string;
		contentClass?: string;
		trigger?: Snippet<[TabsItem]>;
		content?: Snippet<[TabsItem]>;
	};
</script>

<script lang="ts">
	import { Tabs as BitsTabs } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		items,
		value = $bindable(items[0]?.value ?? ''),
		onValueChange,
		orientation = 'horizontal',
		activationMode = 'automatic',
		loop,
		disabled,
		ariaLabel = 'Tabs',
		class: className,
		listClass,
		triggerClass,
		contentClass,
		trigger: triggerSnippet,
		content: contentSnippet,
	}: Props = $props();

	const isVertical = $derived(orientation === 'vertical');
</script>

<BitsTabs.Root
	bind:value
	{onValueChange}
	{orientation}
	{activationMode}
	{loop}
	{disabled}
	data-slot="tabs"
	class={cls('flex gap-2', isVertical ? 'flex-row' : 'flex-col', className)}
>
	<BitsTabs.List
		aria-label={ariaLabel}
		data-slot="tabs-list"
		class={cls(
			'inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
			isVertical ? 'h-auto flex-col' : 'h-9',
			listClass,
		)}
	>
		{#each items as item (item.value)}
			<BitsTabs.Trigger
				value={item.value}
				disabled={item.disabled}
				data-slot="tabs-trigger"
				class={cls(
					'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
					'disabled:pointer-events-none disabled:opacity-50',
					'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
					isVertical && 'w-full justify-start',
					triggerClass,
				)}
			>
				{#if triggerSnippet}
					{@render triggerSnippet(item)}
				{:else}
					{#if item.icon}
						{@const Icon = item.icon}
						<Icon class="size-4" />
					{/if}
					{item.label}
				{/if}
			</BitsTabs.Trigger>
		{/each}
	</BitsTabs.List>

	{#each items as item (item.value)}
		<BitsTabs.Content
			value={item.value}
			data-slot="tabs-content"
			class={cls(
				'text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
				isVertical ? 'flex-1' : 'mt-2',
				contentClass,
			)}
		>
			{#if contentSnippet}
				{@render contentSnippet(item)}
			{/if}
		</BitsTabs.Content>
	{/each}
</BitsTabs.Root>
