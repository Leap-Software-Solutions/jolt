<script lang="ts" module>
	import { FolderIcon, FolderOpenIcon, LockKeyholeIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { moveTreeNode } from './move-tree-node.js';
	import TreeView from './tree-view.svelte';
	import type { TreeNode, TreeNodeMove } from './types.js';

	const nodes: TreeNode[] = [
		{
			id: 'src',
			label: 'src',
			icon: FolderOpenIcon,
			children: [
				{
					id: 'components',
					label: 'components',
					icon: FolderIcon,
					children: [
						{ id: 'button', label: 'button' },
						{ id: 'dialog', label: 'dialog' },
						{ id: 'tree-view', label: 'tree-view' },
					],
				},
				{
					id: 'styles',
					label: 'styles',
					icon: FolderIcon,
					children: [{ id: 'theme', label: 'theme.css' }],
				},
				{ id: 'index', label: 'index.ts' },
			],
		},
		{
			id: 'tests',
			label: 'tests',
			icon: FolderIcon,
			children: [
				{ id: 'consumer', label: 'consumer' },
				{ id: 'fixtures', label: 'fixtures' },
			],
		},
		{ id: 'package', label: 'package.json' },
		{ id: 'archive', label: 'archive', disabled: true },
	];

	const { Story } = defineMeta({
		title: 'Data Display/Tree View',
		component: TreeView,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			nodes,
			ariaLabel: 'Project files',
		},
	});
</script>

<script lang="ts">
	let dragNodes = $state<TreeNode[]>(nodes);
	let dragExpandedIds = $state(['src', 'components']);

	function handleMove(move: TreeNodeMove): void {
		dragNodes = moveTreeNode(dragNodes, move);
	}
</script>

{#snippet template(args: { nodes: TreeNode[]; ariaLabel?: string })}
	<div class="w-[30rem] max-w-full rounded-lg border bg-card p-2">
		<TreeView {...args} />
	</div>
{/snippet}

{#snippet selectionTemplate(args: { nodes: TreeNode[]; ariaLabel?: string })}
	<div class="w-[30rem] max-w-full rounded-lg border bg-card p-2">
		<TreeView {...args} selectionMode="single" expandedIds={['src']} selectedIds={['components']} />
	</div>
{/snippet}

{#snippet checkableTemplate(args: { nodes: TreeNode[]; ariaLabel?: string })}
	<div class="w-[30rem] max-w-full rounded-lg border bg-card p-2">
		<TreeView
			{...args}
			checkable
			expandedIds={['src', 'components']}
			checkedIds={['button', 'dialog']}
		/>
	</div>
{/snippet}

{#snippet customTemplate(args: { nodes: TreeNode[]; ariaLabel?: string })}
	<div class="w-[30rem] max-w-full rounded-lg border bg-card p-2">
		<TreeView
			{...args}
			checkable
			expandedIds={['src', 'components']}
			checkedIds={['button', 'dialog']}
		>
			{#snippet node({ node })}
				<span class="flex min-w-0 flex-1 items-center gap-2">
					<span class="truncate">{node.label}</span>
					{#if node.id === 'tree-view'}
						<span
							class="rounded-full bg-brand-subtle px-2 py-0.5 text-[10px] font-medium text-brand-strong"
						>
							New
						</span>
					{/if}
					{#if node.id === 'package'}
						<LockKeyholeIcon class="size-3.5 text-muted-foreground" />
					{/if}
				</span>
			{/snippet}
		</TreeView>
	</div>
{/snippet}

{#snippet dragTemplate(args: { ariaLabel?: string })}
	<div class="w-[30rem] max-w-full rounded-lg border bg-card p-2">
		<TreeView
			{...args}
			nodes={dragNodes}
			bind:expandedIds={dragExpandedIds}
			draggable
			onMove={handleMove}
		/>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Single selection" template={selectionTemplate} />

<Story name="Checkable" template={checkableTemplate} />

<Story name="Custom node content" template={customTemplate} />

<Story name="Draggable" template={dragTemplate} />

<Story name="Empty" args={{ nodes: [] }} {template} />
