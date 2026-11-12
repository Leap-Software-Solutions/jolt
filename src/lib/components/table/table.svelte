<script lang="ts" generics="T extends object">
	import { cls } from '../../utils/index.js';
	import type { Props, TableColumn } from './types.js';

	let {
		data,
		columns,
		caption,
		empty,
		cell,
		getRowKey = (_row, index) => index,
		class: className,
		tableClass,
	}: Props<T> = $props();

	function formatCell(column: TableColumn<T>, row: T): string {
		const value = column.accessor(row);
		if (column.format) return column.format(value, row);
		if (value === null || value === undefined) return '—';
		return String(value);
	}
</script>

<div data-slot="table" class={cls('relative w-full overflow-x-auto', className)}>
	<table data-slot="table-table" class={cls('w-full caption-bottom text-sm', tableClass)}>
		{#if caption}
			<caption class="sr-only">{caption}</caption>
		{/if}
		<thead data-slot="table-header" class="[&_tr]:border-b">
			<tr class="border-b transition-colors hover:bg-muted/50">
				{#each columns as column (column.id)}
					<th
						scope="col"
						data-slot="table-head"
						class={cls(
							'h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground',
							column.headerClass,
						)}
					>
						{column.header}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody data-slot="table-body" class="[&_tr:last-child]:border-0">
			{#each data as row, index (getRowKey(row, index))}
				<tr class="border-b transition-colors hover:bg-muted/50" data-slot="table-row">
					{#each columns as column (column.id)}
						<td data-slot="table-cell" class={cls('p-3 align-middle', column.class)}>
							{#if cell}
								{@render cell(row, column)}
							{:else}
								{formatCell(column, row)}
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
