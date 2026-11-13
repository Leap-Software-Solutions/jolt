import { expect, test } from 'vitest';
import { moveTreeNode } from './move-tree-node.js';
import type { TreeNode } from './types.js';

const nodes: TreeNode[] = [
	{
		id: 'src',
		label: 'src',
		children: [
			{ id: 'button', label: 'button' },
			{ id: 'dialog', label: 'dialog' },
		],
	},
	{
		id: 'tests',
		label: 'tests',
		children: [{ id: 'fixtures', label: 'fixtures' }],
	},
];

test('moves a node between parents', () => {
	const next = moveTreeNode(nodes, { id: 'button', parentId: 'tests', index: 1 });

	expect(next[0].children?.map((node) => node.id)).toEqual(['dialog']);
	expect(next[1].children?.map((node) => node.id)).toEqual(['fixtures', 'button']);
	expect(nodes[0].children?.map((node) => node.id)).toEqual(['button', 'dialog']);
});

test('reorders siblings without duplicating the source', () => {
	const next = moveTreeNode(nodes, { id: 'button', parentId: 'src', index: 2 });

	expect(next[0].children?.map((node) => node.id)).toEqual(['dialog', 'button']);
});

test('rejects moving a node into its own subtree', () => {
	const next = moveTreeNode(nodes, { id: 'src', parentId: 'button', index: 0 });

	expect(next).toBe(nodes);
});

test('rejects a missing parent', () => {
	const next = moveTreeNode(nodes, { id: 'button', parentId: 'missing', index: 0 });

	expect(next).toBe(nodes);
});
