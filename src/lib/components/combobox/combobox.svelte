<script lang="ts" generics="T">
	import {
		CheckIcon,
		ChevronDownIcon,
		ChevronsUpDownIcon,
		ChevronUpIcon,
		LoaderCircleIcon,
		PlusIcon,
	} from '@lucide/svelte';
	import { Combobox as BitsCombobox } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	const uid = $props.id();
	const createKey = `__jolt_create_${uid}`;

	let {
		items,
		value = $bindable(),
		getKey,
		getLabel,
		onValueChange,
		creatable = false,
		createItem,
		createLabel,
		onSearch,
		debounceMs = 200,
		loading = false,
		placeholder = 'Search...',
		ariaLabel,
		triggerLabel = 'Toggle options',
		class: className,
		inputClass,
		triggerClass,
		contentClass,
		itemClass,
		item: itemSnippet,
		empty: emptySnippet,
		open = $bindable(false),
		onOpenChange,
		disabled,
		required,
		name,
	}: Props<T> = $props();

	let searchQuery = $state('');
	let inputElement = $state<HTMLInputElement | null>(null);
	let createdItem = $state<T | undefined>();
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const query = $derived(searchQuery.trim());
	const createRowLabel = $derived.by(() => {
		if (query.length === 0) return '';
		return createLabel ? createLabel(query) : `Create “${query}”`;
	});
	const canCreate = $derived.by(() => {
		if (!creatable || !createItem || query.length === 0) return false;
		return !items.some((item) => getLabel(item).trim().toLowerCase() === query.toLowerCase());
	});

	const bitItems = $derived([
		...(canCreate ? [{ value: createKey, label: createRowLabel }] : []),
		...items.map((item) => ({
			value: getKey(item),
			label: getLabel(item),
		})),
	]);

	const selectedItem = $derived.by(() => {
		if (value === undefined) return undefined;
		const key = getKey(value);
		const item = items.find((candidate) => getKey(candidate) === key);
		if (item) return item;
		if (createdItem && getKey(createdItem) === key) return createdItem;
		return undefined;
	});
	const selectedLabel = $derived(selectedItem ? getLabel(selectedItem) : '');

	let bitValue = $derived(selectedItem ? getKey(selectedItem) : '');

	const visibleItems = $derived.by(() => {
		if (onSearch || query === '') return items;
		const normalizedQuery = query.toLowerCase();
		return items.filter((item) => getLabel(item).toLowerCase().includes(normalizedQuery));
	});

	function handleValueChange(next: string): void {
		if (next === createKey) {
			if (!createItem || query.length === 0) return;

			const nextItem = createItem(query);
			if (nextItem === undefined) return;

			createdItem = nextItem;
			value = nextItem;
			onValueChange?.(nextItem);
			searchQuery = '';
			if (inputElement) inputElement.value = getLabel(nextItem);
			return;
		}

		const nextItem = items.find((item) => getKey(item) === next);
		createdItem = undefined;
		value = nextItem;
		onValueChange?.(nextItem);
	}

	function scheduleSearch(query: string): void {
		searchQuery = query;
		if (!onSearch) return;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => onSearch(query), debounceMs);
	}

	function handleOpenChange(next: boolean): void {
		open = next;
		onOpenChange?.(next);
		if (next && onSearch) onSearch(searchQuery);
	}

	function handleOpenChangeComplete(next: boolean): void {
		if (next) return;
		searchQuery = '';
		if (inputElement) inputElement.value = selectedLabel;
	}

	$effect(() => {
		if (!open && inputElement) {
			inputElement.value = selectedLabel;
		}
	});

	$effect(() => {
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<BitsCombobox.Root
	type="single"
	bind:open
	onOpenChange={handleOpenChange}
	onOpenChangeComplete={handleOpenChangeComplete}
	{disabled}
	{required}
	{name}
	items={bitItems}
	bind:value={bitValue}
	onValueChange={handleValueChange}
>
	<div class={cls('relative', className)}>
		<BitsCombobox.Input
			bind:ref={inputElement}
			data-slot="combobox-input"
			aria-label={ariaLabel ?? placeholder}
			{placeholder}
			onfocus={(event) => {
				if (event.currentTarget.value) event.currentTarget.select();
			}}
			oninput={(event) => scheduleSearch(event.currentTarget.value)}
			class={cls(
				'flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 pe-9 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
				'placeholder:text-muted-foreground',
				'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
				'disabled:cursor-not-allowed disabled:opacity-50',
				inputClass,
			)}
		/>
		<BitsCombobox.Trigger
			aria-label={triggerLabel}
			onclick={() => {
				inputElement?.focus();
				inputElement?.select();
			}}
			data-slot="combobox-trigger"
			class={cls(
				'absolute end-0 top-0 flex h-9 items-center justify-center px-2.5 text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none',
				'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
				'disabled:pointer-events-none disabled:opacity-50',
				triggerClass,
			)}
		>
			<ChevronsUpDownIcon class="size-4" />
		</BitsCombobox.Trigger>
	</div>

	<BitsCombobox.Portal>
		<BitsCombobox.Content
			data-slot="combobox-content"
			class={cls(
				'relative z-50 max-h-(--bits-combobox-content-available-height) w-(--bits-combobox-anchor-width) min-w-(--bits-combobox-anchor-width) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				contentClass,
			)}
		>
			<BitsCombobox.ScrollUpButton class="flex cursor-default items-center justify-center py-1">
				<ChevronUpIcon class="size-4" />
			</BitsCombobox.ScrollUpButton>
			<BitsCombobox.Viewport class="p-1">
				{#if loading}
					<BitsCombobox.Item
						value="__loading__"
						disabled
						class="flex items-center justify-center gap-2 px-2 py-4 text-sm text-muted-foreground"
					>
						<LoaderCircleIcon class="size-4 animate-spin" />
						Loading...
					</BitsCombobox.Item>
				{:else if visibleItems.length === 0 && !canCreate}
					<BitsCombobox.Item
						value="__empty__"
						disabled
						class="block px-2 py-4 text-center text-sm text-muted-foreground"
					>
						{#if emptySnippet}
							{@render emptySnippet()}
						{:else}
							No results found.
						{/if}
					</BitsCombobox.Item>
				{:else}
					{#if canCreate}
						<BitsCombobox.Item
							value={createKey}
							label={createRowLabel}
							data-slot="combobox-create"
							class={cls(
								'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none',
								'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
								'data-disabled:pointer-events-none data-disabled:opacity-50',
								itemClass,
							)}
						>
							<PlusIcon class="size-4 text-muted-foreground" />
							<span class="truncate">{createRowLabel}</span>
						</BitsCombobox.Item>
					{/if}
					{#each visibleItems as item (getKey(item))}
						<BitsCombobox.Item
							value={getKey(item)}
							label={getLabel(item)}
							data-slot="combobox-item"
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
										{getLabel(item)}
									{/if}
								</span>
								{#if selected}
									<CheckIcon class="absolute end-2 size-4" />
								{/if}
							{/snippet}
						</BitsCombobox.Item>
					{/each}
				{/if}
			</BitsCombobox.Viewport>
			<BitsCombobox.ScrollDownButton class="flex cursor-default items-center justify-center py-1">
				<ChevronDownIcon class="size-4" />
			</BitsCombobox.ScrollDownButton>
		</BitsCombobox.Content>
	</BitsCombobox.Portal>
</BitsCombobox.Root>
