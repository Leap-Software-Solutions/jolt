<script lang="ts">
	import DataTable, { type DataTableColumn } from './data-table.svelte';

	type Engineer = {
		name: string;
		commits: number;
	};

	const engineers: Engineer[] = Array.from({ length: 500 }, (_, index) => ({
		name: `Engineer ${index + 1}`,
		commits: index,
	}));

	const columns: DataTableColumn<Engineer>[] = [
		{ id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
		{ id: 'commits', header: 'Commits', accessor: (row) => row.commits, sortable: true },
	];
</script>

<DataTable data={engineers} {columns} virtualize={{ height: 220 }} />
