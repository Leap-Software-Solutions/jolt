import type { TreeNode, TreeNodeMove } from './types.js';

type FoundNode = {
	node: TreeNode;
	parentId: string | null;
	index: number;
};

function findNode(nodes: TreeNode[], id: string, parentId: string | null = null): FoundNode | null {
	for (const [index, node] of nodes.entries()) {
		if (node.id === id) return { node, parentId, index };
		if (node.children) {
			const found = findNode(node.children, id, node.id);
			if (found) return found;
		}
	}
	return null;
}

function containsNode(node: TreeNode, id: string): boolean {
	if (node.id === id) return true;
	return node.children?.some((child) => containsNode(child, id)) ?? false;
}

function insertAt(nodes: TreeNode[], index: number, node: TreeNode): TreeNode[] {
	const next = [...nodes];
	next.splice(Math.max(0, Math.min(index, next.length)), 0, node);
	return next;
}

function removeNode(nodes: TreeNode[], id: string): TreeNode[] {
	return nodes
		.filter((node) => node.id !== id)
		.map((node) => (node.children ? { ...node, children: removeNode(node.children, id) } : node));
}

function insertNode(
	nodes: TreeNode[],
	parentId: string,
	index: number,
	node: TreeNode,
): TreeNode[] {
	return nodes.map((current) => {
		if (current.id === parentId) {
			return { ...current, children: insertAt(current.children ?? [], index, node) };
		}
		if (current.children) {
			return { ...current, children: insertNode(current.children, parentId, index, node) };
		}
		return current;
	});
}

/**
 * Returns a new tree with the node moved to the requested parent and index.
 * The move is ignored when the source or target parent does not exist, or when
 * the destination would place the node inside its own subtree.
 */
export function moveTreeNode(nodes: TreeNode[], move: TreeNodeMove): TreeNode[] {
	const source = findNode(nodes, move.id);
	if (!source) return nodes;

	if (move.parentId !== null) {
		const parent = findNode(nodes, move.parentId);
		if (!parent || containsNode(source.node, move.parentId)) return nodes;
	}

	const withoutSource = removeNode(nodes, move.id);
	if (move.parentId === null) return insertAt(withoutSource, move.index, source.node);
	return insertNode(withoutSource, move.parentId, move.index, source.node);
}
