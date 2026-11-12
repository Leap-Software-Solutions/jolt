import type { MenuEntry, MenuIcon } from '../../types/menu.js';

export type MenubarSide = 'top' | 'right' | 'bottom' | 'left';
export type MenubarAlign = 'start' | 'center' | 'end';

export type MenubarMenu = {
	value: string;
	label: string;
	items: MenuEntry[];
	icon?: MenuIcon;
	disabled?: boolean;
};

export type Props = {
	menus: MenubarMenu[];
	value?: string;
	onValueChange?: (value: string) => void;
	loop?: boolean;
	dir?: 'ltr' | 'rtl';
	ariaLabel?: string;
	side?: MenubarSide;
	align?: MenubarAlign;
	sideOffset?: number;
	class?: string;
	triggerClass?: string;
	contentClass?: string;
	itemClass?: string;
	subContentClass?: string;
};
