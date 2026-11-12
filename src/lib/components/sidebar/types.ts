import type { Component, Snippet } from 'svelte';

export type SidebarItem = {
	label: string;
	href?: string;
	icon?: Component<{ class?: string }>;
	active?: boolean;
	badge?: string;
	disabled?: boolean;
	onSelect?: () => void;
};

export type SidebarGroup = {
	label?: string;
	items: SidebarItem[];
};

export type SidebarSlotProps = {
	collapsed: boolean;
};

export type Props = {
	groups: SidebarGroup[];
	header?: Snippet<[SidebarSlotProps]>;
	footer?: Snippet<[SidebarSlotProps]>;
	collapsed?: boolean;
	class?: string;
	itemClass?: string;
	ariaLabel?: string;
};
