<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import type { DataTableColumn, Props as DataTableProps } from './data-table.svelte';
	import DataTable from './data-table.svelte';

	type Engineer = {
		name: string;
		role: string;
		commits: number;
	};

	const engineers: Engineer[] = [
		{ name: 'Ada Lovelace', role: 'Engineering', commits: 128 },
		{ name: 'Grace Hopper', role: 'Platform', commits: 96 },
		{ name: 'Alan Turing', role: 'Research', commits: 74 },
		{ name: 'Katherine Johnson', role: 'Data', commits: 61 },
	];

	const manyEngineers: Engineer[] = Array.from({ length: 1_000 }, (_, index) => ({
		name: `Engineer ${index + 1}`,
		role: index % 2 === 0 ? 'Engineering' : 'Platform',
		commits: 128 - (index % 96),
	}));

	const columns: DataTableColumn<Engineer>[] = [
		{ id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
		{ id: 'role', header: 'Role', accessor: (row) => row.role, sortable: true },
		{ id: 'commits', header: 'Commits', accessor: (row) => row.commits, sortable: true },
	];

	const DataTableEngineers = DataTable as unknown as Component<DataTableProps<Engineer>>;

	const { Story } = defineMeta({
		title: 'Data Display/Data Table',
		component: DataTableEngineers,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			data: engineers,
			columns,
			caption: 'Engineers and their contribution totals',
		},
	});

	type TemplateArgs = DataTableProps<Engineer>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-[36rem] rounded-lg border bg-card">
		<DataTable {...args} />
	</div>
{/snippet}

{#snippet customCellTemplate(args: TemplateArgs)}
	<div class="w-[36rem] rounded-lg border bg-card">
		<DataTable {...args}>
			{#snippet cell(row, column)}
				{#if column.id === 'name'}
					<span class="font-medium">{row.name}</span>
				{:else if column.id === 'role'}
					<span class="rounded-full bg-muted px-2 py-0.5 text-xs">{row.role}</span>
				{:else}
					{row.commits.toLocaleString()}
				{/if}
			{/snippet}
		</DataTable>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Custom cells" template={customCellTemplate} />

<Story name="Virtualized" args={{ data: manyEngineers, virtualize: { height: 320 } }} {template} />

<Story name="Empty" args={{ data: [] }} {template} />
