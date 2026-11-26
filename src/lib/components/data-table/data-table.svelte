<script lang="ts" generics="T extends object">
	import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/svelte';
	import {
		type ColumnDef,
		createSortedRowModel,
		createTable,
		rowSortingFeature,
		sortFn_alphanumeric,
		sortFn_text,
		tableFeatures,
	} from '@tanstack/svelte-table';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import type { Snippet } from 'svelte';
	import { get } from 'svelte/store';
	import { cls } from '../../utils/index.js';
	import { Checkbox } from '../checkbox/index.js';

	const DEFAULT_ROW_HEIGHT = 45;
	const DEFAULT_OVERSCAN = 8;

	export type DataTableVirtualization = {
		/** Fixed scroll viewport height in pixels. */
		height: number;
		/** Initial row height estimate in pixels. Rendered rows are measured. */
		rowHeight?: number;
	};

	export type DataTableSelectionMode = 'none' | 'single' | 'multiple';

	export type DataTableColumn<T extends object> = {
		id: string;
		header: string;
		accessor: (row: T) => unknown;
		sortable?: boolean;
		format?: (value: unknown, row: T) => string;
		class?: string;
		headerClass?: string;
	};

	export type Props<T extends object> = {
		data: T[];
		columns: DataTableColumn<T>[];
		caption?: string;
		empty?: Snippet;
		cell?: Snippet<[T, DataTableColumn<T>]>;
		selectionMode?: DataTableSelectionMode;
		selectedIds?: string[];
		getRowId?: (row: T) => string;
		onSelectionChange?: (ids: string[]) => void;
		virtualize?: DataTableVirtualization;
		class?: string;
		tableClass?: string;
	};

	type DataTableRow<T extends object> = {
		id: string;
		original: T;
	};

	let {
		data,
		columns,
		caption,
		empty,
		cell,
		selectionMode = 'none',
		selectedIds = $bindable([]),
		getRowId,
		onSelectionChange,
		virtualize,
		class: className,
		tableClass,
	}: Props<T> = $props();

	let scrollElement = $state<HTMLDivElement>();

	const features = tableFeatures({
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: {
			alphanumeric: sortFn_alphanumeric,
			text: sortFn_text,
		},
	});

	const tableColumns = $derived.by<ColumnDef<typeof features, T>[]>(() =>
		columns.map((column) => ({
			id: column.id,
			accessorFn: column.accessor,
			header: column.header,
			enableSorting: column.sortable ?? false,
		})),
	);

	const table = createTable({
		features,
		get columns() {
			return tableColumns;
		},
		get data() {
			return data;
		},
		getRowId: (row, index) => getRowId?.(row) ?? String(index),
	});

	const rows = $derived(table.getRowModel().rows);
	const selectedSet = $derived(new Set(selectedIds));
	const displayedColumnCount = $derived(columns.length + (selectionMode === 'none' ? 0 : 1));
	const allSelected = $derived(rows.length > 0 && rows.every((row) => selectedSet.has(row.id)));
	const someSelected = $derived(rows.some((row) => selectedSet.has(row.id)));
	const rowHeight = $derived(virtualize?.rowHeight ?? DEFAULT_ROW_HEIGHT);

	const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		get count() {
			return rows.length;
		},
		getScrollElement: () => scrollElement ?? null,
		estimateSize: () => rowHeight,
		getItemKey: (index) => rows[index]?.id ?? index,
		overscan: DEFAULT_OVERSCAN,
	});

	const virtualItems = $derived(virtualize ? $rowVirtualizer.getVirtualItems() : []);
	const virtualPaddingTop = $derived(virtualItems[0]?.start ?? 0);
	const virtualPaddingBottom = $derived(
		virtualItems.length > 0
			? Math.max(0, $rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end)
			: 0,
	);

	$effect(() => {
		const currentRows = rows;
		get(rowVirtualizer).setOptions({
			count: currentRows.length,
			enabled: Boolean(virtualize),
			estimateSize: () => rowHeight,
			getItemKey: (index) => currentRows[index]?.id ?? index,
		});
	});

	function getAriaSort(direction: false | 'asc' | 'desc'): 'ascending' | 'descending' | 'none' {
		if (direction === 'asc') return 'ascending';
		if (direction === 'desc') return 'descending';
		return 'none';
	}

	function formatCell(column: DataTableColumn<T>, row: T): string {
		const value = column.accessor(row);
		if (column.format) return column.format(value, row);
		if (value === null || value === undefined) return '—';
		return String(value);
	}

	function emitSelection(next: string[]): void {
		selectedIds = next;
		onSelectionChange?.(next);
	}

	function toggleRow(id: string, checked: boolean): void {
		if (selectionMode === 'single') {
			emitSelection(checked ? [id] : []);
			return;
		}

		if (checked) {
			emitSelection(selectedIds.includes(id) ? selectedIds : [...selectedIds, id]);
			return;
		}

		emitSelection(selectedIds.filter((selectedId) => selectedId !== id));
	}

	function toggleAll(checked: boolean): void {
		emitSelection(checked ? rows.map((row) => row.id) : []);
	}

	function measureRow(node: HTMLTableRowElement) {
		if (!virtualize) return;
		get(rowVirtualizer).measureElement(node);
	}
</script>

{#snippet dataRow(row: DataTableRow<T>, index?: number)}
	{@const isSelected = selectedSet.has(row.id)}
	<tr
		class={cls('border-b transition-colors hover:bg-muted/50', isSelected && 'bg-muted/60')}
		data-slot="data-table-row"
		data-selected={isSelected ? 'true' : undefined}
		data-index={index}
		aria-rowindex={index !== undefined ? index + 2 : undefined}
		use:measureRow
	>
		{#if selectionMode !== 'none'}
			<td data-slot="data-table-select" class="w-10 p-3 align-middle">
				<Checkbox
					checked={isSelected}
					label={`Select row ${row.id}`}
					class="[&>span]:sr-only"
					onCheckedChange={(checked) => toggleRow(row.id, checked)}
				/>
			</td>
		{/if}
		{#each columns as column (column.id)}
			<td data-slot="data-table-cell" class={cls('p-3 align-middle', column.class)}>
				{#if cell}
					{@render cell(row.original, column)}
				{:else}
					{formatCell(column, row.original)}
				{/if}
			</td>
		{/each}
	</tr>
{/snippet}

{#snippet emptyRow()}
	<tr class="border-b">
		<td colspan={displayedColumnCount} class="p-6 text-center text-sm text-muted-foreground">
			{#if empty}
				{@render empty()}
			{:else}
				No results.
			{/if}
		</td>
	</tr>
{/snippet}

<div
	data-slot="data-table"
	bind:this={scrollElement}
	class={cls('relative w-full', virtualize ? 'overflow-auto' : 'overflow-x-auto', className)}
	style:height={virtualize ? `${virtualize.height}px` : undefined}
>
	<table
		data-slot="data-table-table"
		aria-rowcount={virtualize ? rows.length + 1 : undefined}
		class={cls('w-full caption-bottom text-sm', tableClass)}
	>
		{#if caption}
			<caption class="sr-only">{caption}</caption>
		{/if}
		<thead
			data-slot="data-table-header"
			class={cls('[&_tr]:border-b', virtualize && 'sticky top-0 z-10 bg-card')}
		>
			<tr class="border-b transition-colors hover:bg-muted/50">
				{#if selectionMode !== 'none'}
					<th scope="col" data-slot="data-table-select" class="w-10 px-3 align-middle">
						{#if selectionMode === 'multiple'}
							<Checkbox
								checked={allSelected}
								indeterminate={someSelected && !allSelected}
								label="Select all rows"
								class="[&>span]:sr-only"
								onCheckedChange={toggleAll}
							/>
						{:else}
							<span class="sr-only">Select a row</span>
						{/if}
					</th>
				{/if}
				{#each columns as column (column.id)}
					{@const tableColumn = table.getColumn(column.id)}
					{@const sorted = tableColumn?.getIsSorted() ?? false}
					<th
						scope="col"
						aria-sort={column.sortable ? getAriaSort(sorted) : undefined}
						data-slot="data-table-head"
						class={cls(
							'h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground',
							column.headerClass,
						)}
					>
						{#if column.sortable && tableColumn}
							<button
								type="button"
								class="inline-flex items-center gap-1.5 rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								onclick={tableColumn.getToggleSortingHandler()}
							>
								{column.header}
								{#if sorted === 'asc'}
									<ArrowUpIcon class="size-3.5" />
								{:else if sorted === 'desc'}
									<ArrowDownIcon class="size-3.5" />
								{:else}
									<ArrowUpDownIcon class="size-3.5 opacity-50" />
								{/if}
							</button>
						{:else}
							{column.header}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody data-slot="data-table-body" class="[&_tr:last-child]:border-0">
			{#if virtualize}
				{#if rows.length === 0}
					{@render emptyRow()}
				{:else}
					{#if virtualPaddingTop > 0}
						<tr
							aria-hidden="true"
							data-slot="data-table-spacer"
							class="border-0 hover:bg-transparent"
							style:height={`${virtualPaddingTop}px`}
						>
							<td colspan={displayedColumnCount} class="p-0"></td>
						</tr>
					{/if}
					{#each virtualItems as virtualRow (virtualRow.key)}
						{@const row = rows[virtualRow.index]}
						{#if row}
							{@render dataRow(row, virtualRow.index)}
						{/if}
					{/each}
					{#if virtualPaddingBottom > 0}
						<tr
							aria-hidden="true"
							data-slot="data-table-spacer"
							class="border-0 hover:bg-transparent"
							style:height={`${virtualPaddingBottom}px`}
						>
							<td colspan={displayedColumnCount} class="p-0"></td>
						</tr>
					{/if}
				{/if}
			{:else}
				{#each rows as row (row.id)}
					{@render dataRow(row)}
				{:else}
					{@render emptyRow()}
				{/each}
			{/if}
		</tbody>
	</table>
</div>
