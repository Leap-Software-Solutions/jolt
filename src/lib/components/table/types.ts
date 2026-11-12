import type { Snippet } from 'svelte';

export type TableColumn<T extends object> = {
	id: string;
	header: string;
	accessor: (row: T) => unknown;
	format?: (value: unknown, row: T) => string;
	class?: string;
	headerClass?: string;
};

export type Props<T extends object> = {
	data: T[];
	columns: TableColumn<T>[];
	caption?: string;
	empty?: Snippet;
	cell?: Snippet<[T, TableColumn<T>]>;
	getRowKey?: (row: T, index: number) => string | number;
	class?: string;
	tableClass?: string;
};
