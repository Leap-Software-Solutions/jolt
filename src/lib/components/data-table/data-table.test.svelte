<script lang="ts">
	import DataTable, { type DataTableColumn } from './data-table.svelte';

	type Engineer = {
		name: string;
		commits: number;
	};

	const engineers: Engineer[] = [
		{ name: 'Grace Hopper', commits: 96 },
		{ name: 'Ada Lovelace', commits: 128 },
	];

	const columns: DataTableColumn<Engineer>[] = [
		{ id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
		{ id: 'commits', header: 'Commits', accessor: (row) => row.commits, sortable: true },
	];
</script>

<DataTable data={engineers} {columns} />
