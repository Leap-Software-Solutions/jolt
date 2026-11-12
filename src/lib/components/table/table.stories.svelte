<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import Table from './table.svelte';
	import type { Props as TableProps, TableColumn } from './types.js';

	type Engineer = {
		name: string;
		role: string;
		commits: number;
	};

	const engineers: Engineer[] = [
		{ name: 'Ada Lovelace', role: 'Engineering', commits: 128 },
		{ name: 'Grace Hopper', role: 'Platform', commits: 96 },
		{ name: 'Alan Turing', role: 'Research', commits: 74 },
	];

	const columns: TableColumn<Engineer>[] = [
		{ id: 'name', header: 'Name', accessor: (row) => row.name },
		{ id: 'role', header: 'Role', accessor: (row) => row.role },
		{ id: 'commits', header: 'Commits', accessor: (row) => row.commits },
	];

	const TableEngineers = Table as unknown as Component<TableProps<Engineer>>;

	const { Story } = defineMeta({
		title: 'Data Display/Table',
		component: TableEngineers,
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
</script>

{#snippet template(args: TableProps<Engineer>)}
	<div class="w-[36rem] rounded-lg border bg-card">
		<Table {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Empty" args={{ data: [] }} {template} />
