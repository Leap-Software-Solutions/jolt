import type { Component, Snippet } from 'svelte';

export type NavigationMenuIcon = Component<{ class?: string }>;

export type NavigationMenuLinkItem = {
	value: string;
	label: string;
	href: string;
	content?: never;
	icon?: NavigationMenuIcon;
	active?: boolean;
	disabled?: boolean;
	onSelect?: (event: Event) => void;
};

export type NavigationMenuPanelItem = {
	value: string;
	label: string;
	content: Snippet<[NavigationMenuPanelItem]>;
	href?: never;
	icon?: NavigationMenuIcon;
	disabled?: boolean;
};

export type NavigationMenuItem = NavigationMenuLinkItem | NavigationMenuPanelItem;

export type Props = {
	items: NavigationMenuItem[];
	value?: string;
	onValueChange?: (value: string) => void;
	trigger?: Snippet<[NavigationMenuPanelItem]>;
	ariaLabel?: string;
	orientation?: 'horizontal' | 'vertical';
	delayDuration?: number;
	skipDelayDuration?: number;
	class?: string;
	listClass?: string;
	itemClass?: string;
	triggerClass?: string;
	contentClass?: string;
	linkClass?: string;
	viewportClass?: string;
};
