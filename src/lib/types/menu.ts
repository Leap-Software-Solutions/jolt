import type { Component } from 'svelte';

export type MenuIcon = Component<{ class?: string }>;

export type MenuItem = {
	type?: 'item';
	label: string;
	icon?: MenuIcon;
	shortcut?: string;
	disabled?: boolean;
	variant?: 'default' | 'destructive';
	onSelect?: (event: Event) => void;
	closeOnSelect?: boolean;
};

export type MenuSeparator = {
	type: 'separator';
};

export type MenuGroup = {
	type: 'group';
	label?: string;
	items: MenuEntry[];
};

export type MenuSubmenu = {
	type: 'submenu';
	label: string;
	icon?: MenuIcon;
	disabled?: boolean;
	items: MenuEntry[];
};

export type MenuCheckbox = {
	type: 'checkbox';
	label: string;
	checked?: boolean;
	disabled?: boolean;
	closeOnSelect?: boolean;
	onCheckedChange?: (checked: boolean) => void;
};

export type MenuRadioItem = {
	value: string;
	label: string;
	disabled?: boolean;
	closeOnSelect?: boolean;
};

export type MenuRadio = {
	type: 'radio';
	label?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	items: MenuRadioItem[];
};

export type MenuEntry =
	MenuItem | MenuSeparator | MenuGroup | MenuSubmenu | MenuCheckbox | MenuRadio;
