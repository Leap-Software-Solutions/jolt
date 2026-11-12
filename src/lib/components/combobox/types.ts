import type { Snippet } from 'svelte';

export type Props<T> = {
	items: T[];
	value?: T;
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	onValueChange?: (value: T | undefined) => void;
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
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	class?: string;
	inputClass?: string;
	triggerClass?: string;
	contentClass?: string;
	itemClass?: string;
	item?: Snippet<[T]>;
	empty?: Snippet;
};
