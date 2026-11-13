<script lang="ts">
	import TreeView from './tree-view.svelte';
	import type { TreeNode, TreeNodeMove, TreeSelectionMode } from './types.js';

	type Props = {
		selectionMode?: TreeSelectionMode;
		checkable?: boolean;
		draggable?: boolean;
	};

	let { selectionMode = 'single', checkable = false, draggable = false }: Props = $props();

	const nodes: TreeNode[] = [
		{
			id: 'src',
			label: 'src',
			children: [
				{
					id: 'components',
					label: 'components',
					children: [
						{ id: 'button', label: 'button' },
						{ id: 'dialog', label: 'dialog' },
					],
				},
				{ id: 'index', label: 'index.ts' },
			],
		},
		{
			id: 'tests',
			label: 'tests',
			children: [{ id: 'fixtures', label: 'fixtures' }],
		},
	];

	let expandedIds = $state(['src', 'components']);
	let selectedIds = $state<string[]>([]);
	let checkedIds = $state<string[]>([]);
	let moves = $state<TreeNodeMove[]>([]);

	function handleMove(move: TreeNodeMove): void {
		moves = [...moves, move];
	}
</script>

<TreeView
	{nodes}
	bind:expandedIds
	bind:selectedIds
	bind:checkedIds
	{selectionMode}
	{checkable}
	{draggable}
	onMove={handleMove}
	ariaLabel="Test tree"
/>
<span data-testid="expanded">{expandedIds.join(',')}</span>
<span data-testid="selected">{selectedIds.join(',')}</span>
<span data-testid="checked">{checkedIds.join(',')}</span>
<span data-testid="moves">{JSON.stringify(moves)}</span>
