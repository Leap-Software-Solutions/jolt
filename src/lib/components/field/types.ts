import type { Snippet } from 'svelte';
import type { SelectItem } from '../select/types.js';

export type TextFieldType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

export type TextFieldProps = {
	label?: string;
	hint?: string;
	error?: string;
	value?: string | number;
	type?: TextFieldType;
	placeholder?: string;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	readonly?: boolean;
	autocomplete?: string;
	maxlength?: number;
	ariaLabel?: string;
	class?: string;
	inputClass?: string;
};

export type TextareaFieldProps = {
	label?: string;
	hint?: string;
	error?: string;
	value?: string;
	placeholder?: string;
	name?: string;
	rows?: number;
	disabled?: boolean;
	required?: boolean;
	readonly?: boolean;
	maxlength?: number;
	ariaLabel?: string;
	class?: string;
	textareaClass?: string;
};

export type CheckboxFieldProps = {
	label: string;
	description?: string;
	error?: string;
	checked?: boolean;
	indeterminate?: boolean;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
	class?: string;
	labelClass?: string;
	descriptionClass?: string;
	errorClass?: string;
	onCheckedChange?: (checked: boolean) => void;
	onIndeterminateChange?: (indeterminate: boolean) => void;
};

export type SelectFieldProps<T> = {
	label?: string;
	hint?: string;
	error?: string;
	items: SelectItem<T>[];
	value?: T;
	getKey?: (value: T) => string;
	onValueChange?: (value: T | undefined) => void;
	placeholder?: string;
	ariaLabel?: string;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	class?: string;
	triggerClass?: string;
	contentClass?: string;
	itemClass?: string;
	item?: Snippet<[SelectItem<T>]>;
	selected?: Snippet<[SelectItem<T>]>;
	empty?: Snippet;
};
