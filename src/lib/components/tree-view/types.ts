import type { Component, Snippet } from 'svelte';

export type TreeIcon = Component<{ class?: string }>;

export type TreeNode = {
	id: string;
	label: string;
	icon?: TreeIcon;
	children?: TreeNode[];
	disabled?: boolean;
};

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export type TreeCheckState = 'checked' | 'unchecked' | 'indeterminate';

export type TreeNodeMove = {
	id: string;
	parentId: string | null;
	index: number;
};

export type TreeViewSlotProps = {
	node: TreeNode;
	level: number;
	expanded: boolean;
	selected: boolean;
	checked: TreeCheckState;
};

export type Props = {
	nodes: TreeNode[];
	expandedIds?: string[];
	selectedIds?: string[];
	checkedIds?: string[];
	selectionMode?: TreeSelectionMode;
	checkable?: boolean;
	cascade?: boolean;
	draggable?: boolean;
	ariaLabel?: string;
	empty?: Snippet;
	node?: Snippet<[TreeViewSlotProps]>;
	onExpandedChange?: (ids: string[]) => void;
	onSelectionChange?: (ids: string[]) => void;
	onCheckedChange?: (ids: string[]) => void;
	onSelect?: (node: TreeNode) => void;
	onMove?: (move: TreeNodeMove) => void;
	class?: string;
	rowClass?: string;
};
