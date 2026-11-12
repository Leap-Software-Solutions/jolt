import type { Snippet } from 'svelte';

export type Props<T> = {
	items: T[];
	values?: T[];
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	onValuesChange?: (values: T[]) => void;
	/**
	 * Called with the current input value after `debounceMs`. When omitted, the
	 * component filters `items` locally by `getLabel`.
	 */
	onSearch?: (query: string) => void;
	debounceMs?: number;
	loading?: boolean;
	placeholder?: string;
	ariaLabel?: string;
	triggerLabel?: string;
	id?: string;
	describedBy?: string;
	invalid?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	class?: string;
	inputClass?: string;
	triggerClass?: string;
	contentClass?: string;
	itemClass?: string;
	chipClass?: string;
	item?: Snippet<[T]>;
	empty?: Snippet;
};
