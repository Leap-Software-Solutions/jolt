<script lang="ts" generics="T">
	import {
		CheckIcon,
		ChevronDownIcon,
		ChevronsUpDownIcon,
		ChevronUpIcon,
		LoaderCircleIcon,
		XIcon,
	} from '@lucide/svelte';
	import { Combobox as BitsCombobox } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	let {
		items,
		values = $bindable([]),
		getKey,
		getLabel,
		onValuesChange,
		onSearch,
		debounceMs = 200,
		loading = false,
		placeholder = 'Select options...',
		ariaLabel,
		triggerLabel = 'Toggle options',
		id,
		describedBy,
		invalid,
		open = $bindable(false),
		onOpenChange,
		disabled,
		class: className,
		inputClass,
		triggerClass,
		contentClass,
		itemClass,
		chipClass,
		item: itemSnippet,
		empty: emptySnippet,
	}: Props<T> = $props();

	let searchQuery = $state('');
	let inputElement = $state<HTMLInputElement | null>(null);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const selectedItems = $derived.by(() =>
		values
			.map((value) => items.find((item) => getKey(item) === getKey(value)))
			.filter((item): item is T => item !== undefined),
	);

	const bitItems = $derived(
		items.map((item) => ({
			value: getKey(item),
			label: getLabel(item),
		})),
	);

	let bitValues = $derived(selectedItems.map((item) => getKey(item)));

	const visibleItems = $derived.by(() => {
		if (onSearch || searchQuery.trim() === '') return items;
		const query = searchQuery.trim().toLowerCase();
		return items.filter((item) => getLabel(item).toLowerCase().includes(query));
	});

	function handleValuesChange(next: string[]): void {
		const nextValues = next
			.map((key) => items.find((item) => getKey(item) === key))
			.filter((item): item is T => item !== undefined);

		values = nextValues;
		onValuesChange?.(nextValues);
		searchQuery = '';
		if (inputElement) inputElement.value = '';
		if (onSearch) {
			if (debounceTimer) clearTimeout(debounceTimer);
			onSearch('');
		}
	}

	function removeValue(key: string): void {
		const nextValues = values.filter((item) => getKey(item) !== key);
		values = nextValues;
		onValuesChange?.(nextValues);
		if (inputElement) inputElement.value = '';
		searchQuery = '';
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
		if (inputElement) inputElement.value = '';
	}

	$effect(() => {
		if (!open || !inputElement || values.length === 0) return;
		inputElement.value = '';
		searchQuery = '';
	});

	$effect(() => {
		if (!open && inputElement) {
			inputElement.value = '';
		}
	});

	$effect(() => {
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<BitsCombobox.Root
	type="multiple"
	bind:open
	onOpenChange={handleOpenChange}
	onOpenChangeComplete={handleOpenChangeComplete}
	{disabled}
	items={bitItems}
	bind:value={bitValues}
	onValueChange={handleValuesChange}
>
	<div
		data-slot="multi-select"
		class={cls(
			'relative flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1 pe-9 text-sm shadow-xs transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
			'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
			invalid && 'border-destructive focus-within:ring-destructive',
			disabled && 'cursor-not-allowed bg-muted/30',
			className,
		)}
	>
		{#each selectedItems as item (getKey(item))}
			<span
				data-slot="multi-select-chip"
				class={cls(
					'inline-flex max-w-full items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground',
					chipClass,
				)}
			>
				<span class="truncate">{getLabel(item)}</span>
				<button
					type="button"
					aria-label={`Remove ${getLabel(item)}`}
					class="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none"
					{disabled}
					onclick={() => removeValue(getKey(item))}
				>
					<XIcon class="size-3" />
				</button>
			</span>
		{/each}

		<BitsCombobox.Input
			bind:ref={inputElement}
			{id}
			data-slot="multi-select-input"
			aria-label={ariaLabel ?? placeholder}
			aria-describedby={describedBy}
			aria-invalid={invalid || undefined}
			{disabled}
			placeholder={selectedItems.length ? '' : placeholder}
			onfocus={() => {
				if (!open) handleOpenChange(true);
			}}
			oninput={(event) => scheduleSearch(event.currentTarget.value)}
			class={cls(
				'min-w-20 flex-1 border-0 bg-transparent p-0 text-sm shadow-none outline-hidden placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed',
				inputClass,
			)}
		/>

		<BitsCombobox.Trigger
			aria-label={triggerLabel}
			onclick={() => {
				inputElement?.focus();
			}}
			data-slot="multi-select-trigger"
			class={cls(
				'absolute end-0 top-1/2 flex h-8 -translate-y-1/2 items-center justify-center px-2.5 text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none',
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
			data-slot="multi-select-content"
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
				{:else if visibleItems.length === 0}
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
					{#each visibleItems as item (getKey(item))}
						<BitsCombobox.Item
							value={getKey(item)}
							label={getLabel(item)}
							data-slot="multi-select-item"
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
