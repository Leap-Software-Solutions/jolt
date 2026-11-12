import type { Snippet } from 'svelte';

export type SelectItem<T> = {
	value: T;
	label: string;
	disabled?: boolean;
};

export type SelectAlign = 'start' | 'center' | 'end';
export type SelectSide = 'top' | 'right' | 'bottom' | 'left';

export type Props<T> = {
	items: SelectItem<T>[];
	value?: T;
	/**
	 * Maps an item value to the string key used by bits-ui. Required for object values.
	 * Defaults to the index of the item in `items`.
	 */
	getKey?: (value: T) => string;
	onValueChange?: (value: T | undefined) => void;
	placeholder?: string;
	ariaLabel?: string;
	id?: string;
	describedBy?: string;
	invalid?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	align?: SelectAlign;
	side?: SelectSide;
	sideOffset?: number;
	class?: string;
	triggerClass?: string;
	contentClass?: string;
	itemClass?: string;
	item?: Snippet<[SelectItem<T>]>;
	selected?: Snippet<[SelectItem<T>]>;
	empty?: Snippet;
};
