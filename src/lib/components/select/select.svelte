<script lang="ts" generics="T">
	import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@lucide/svelte';
	import { Select as BitsSelect } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { Props, SelectItem } from './types.js';

	let {
		items,
		value = $bindable(),
		getKey,
		onValueChange,
		placeholder = 'Select an option',
		ariaLabel,
		align = 'start',
		side = 'bottom',
		sideOffset = 4,
		class: className,
		triggerClass,
		contentClass,
		itemClass,
		item: itemSnippet,
		selected: selectedSnippet,
		empty: emptySnippet,
		open = $bindable(false),
		onOpenChange,
		disabled,
		required,
		name,
	}: Props<T> = $props();

	function getItemKey(item: SelectItem<T>, index: number): string {
		if (getKey) return getKey(item.value);
		if (typeof item.value === 'string' || typeof item.value === 'number') {
			return String(item.value);
		}
		return String(index);
	}

	const bitItems = $derived(
		items.map((item, index) => ({
			value: getItemKey(item, index),
			label: item.label,
			disabled: item.disabled,
		})),
	);

	const selectedIndex = $derived.by(() => {
		if (value === undefined) return -1;
		if (getKey) {
			const key = getKey(value);
			return items.findIndex((item) => getKey(item.value) === key);
		}
		return items.findIndex((item) => Object.is(item.value, value));
	});

	const selectedItem = $derived(selectedIndex === -1 ? undefined : items[selectedIndex]);

	let bitValue = $derived(
		selectedIndex === -1 ? '' : getItemKey(items[selectedIndex], selectedIndex),
	);

	function handleValueChange(next: string): void {
		const index = bitItems.findIndex((item) => item.value === next);
		const nextValue = index === -1 ? undefined : items[index].value;
		value = nextValue;
		onValueChange?.(nextValue);
	}
</script>

<BitsSelect.Root
	type="single"
	bind:open
	{onOpenChange}
	{disabled}
	{required}
	{name}
	items={bitItems}
	bind:value={bitValue}
	onValueChange={handleValueChange}
>
	<BitsSelect.Trigger
		aria-label={ariaLabel}
		data-slot="select-trigger"
		class={cls(
			'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			'disabled:cursor-not-allowed disabled:opacity-50',
			triggerClass,
			className,
		)}
	>
		{#if selectedSnippet}
			<BitsSelect.Value {placeholder}>
				{#snippet children({ selection })}
					{#if selection.type === 'single' && selection.selected}
						{#if selectedItem}
							{@render selectedSnippet(selectedItem)}
						{:else}
							{selection.selected.label}
						{/if}
					{:else}
						{placeholder}
					{/if}
				{/snippet}
			</BitsSelect.Value>
		{:else}
			<BitsSelect.Value {placeholder} class="truncate data-[placeholder]:text-muted-foreground" />
		{/if}
		<ChevronDownIcon class="size-4 shrink-0 opacity-50" />
	</BitsSelect.Trigger>

	<BitsSelect.Portal>
		<BitsSelect.Content
			{side}
			{align}
			{sideOffset}
			data-slot="select-content"
			class={cls(
				'relative z-50 max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				contentClass,
			)}
		>
			<BitsSelect.ScrollUpButton class="flex cursor-default items-center justify-center py-1">
				<ChevronUpIcon class="size-4" />
			</BitsSelect.ScrollUpButton>
			<BitsSelect.Viewport class="p-1">
				{#if items.length === 0}
					<BitsSelect.Item
						value="__empty__"
						label="No options available."
						disabled
						class="pointer-events-none block px-2 py-6 text-center text-sm text-muted-foreground"
					>
						{#if emptySnippet}
							{@render emptySnippet()}
						{:else}
							No options available.
						{/if}
					</BitsSelect.Item>
				{:else}
					{#each items as item, index (getItemKey(item, index))}
						<BitsSelect.Item
							value={getItemKey(item, index)}
							label={item.label}
							disabled={item.disabled}
							data-slot="select-item"
							class={cls(
								'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none',
								'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
								'data-disabled:pointer-events-none data-disabled:opacity-50',
								itemClass,
							)}
						>
							{#snippet children({ selected })}
								<span class="truncate">
									{#if itemSnippet}
										{@render itemSnippet(item)}
									{:else}
										{item.label}
									{/if}
								</span>
								{#if selected}
									<CheckIcon class="absolute end-2 size-4" />
								{/if}
							{/snippet}
						</BitsSelect.Item>
					{/each}
				{/if}
			</BitsSelect.Viewport>
			<BitsSelect.ScrollDownButton class="flex cursor-default items-center justify-center py-1">
				<ChevronDownIcon class="size-4" />
			</BitsSelect.ScrollDownButton>
		</BitsSelect.Content>
	</BitsSelect.Portal>
</BitsSelect.Root>
