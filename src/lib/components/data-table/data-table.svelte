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
	import type { Snippet } from 'svelte';
	import { cls } from '../../utils/index.js';

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
		class?: string;
		tableClass?: string;
	};

	let { data, columns, caption, empty, cell, class: className, tableClass }: Props<T> = $props();

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
</script>

<div data-slot="data-table" class={cls('relative w-full overflow-x-auto', className)}>
	<table data-slot="data-table-table" class={cls('w-full caption-bottom text-sm', tableClass)}>
		{#if caption}
			<caption class="sr-only">{caption}</caption>
		{/if}
		<thead data-slot="data-table-header" class="[&_tr]:border-b">
			<tr class="border-b transition-colors hover:bg-muted/50">
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
			{#each table.getRowModel().rows as row (row.id)}
				<tr class="border-b transition-colors hover:bg-muted/50" data-slot="data-table-row">
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
			{:else}
				<tr class="border-b">
					<td colspan={columns.length} class="p-6 text-center text-sm text-muted-foreground">
						{#if empty}
							{@render empty()}
						{:else}
							No results.
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
