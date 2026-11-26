<script lang="ts">
	import DataTable, {
		type DataTableColumn,
		type DataTableSelectionMode,
	} from './data-table.svelte';

	type Engineer = {
		name: string;
		commits: number;
	};

	let {
		selectionMode = 'multiple',
		onSelectionChange,
	}: {
		selectionMode?: DataTableSelectionMode;
		onSelectionChange?: (ids: string[]) => void;
	} = $props();

	const engineers: Engineer[] = [
		{ name: 'Grace Hopper', commits: 96 },
		{ name: 'Ada Lovelace', commits: 128 },
	];

	const columns: DataTableColumn<Engineer>[] = [
		{ id: 'name', header: 'Name', accessor: (row) => row.name },
		{ id: 'commits', header: 'Commits', accessor: (row) => row.commits },
	];
</script>

<DataTable
	data={engineers}
	{columns}
	{selectionMode}
	getRowId={(row) => row.name}
	{onSelectionChange}
/>
