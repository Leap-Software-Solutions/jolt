<script lang="ts">
	import { CheckIcon, ChevronRightIcon, MinusIcon } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { cls } from '../../utils/index.js';
	import type {
		Props,
		TreeCheckState,
		TreeNode,
		TreeNodeMove,
		TreeViewSlotProps,
	} from './types.js';

	type IndexedNode = {
		node: TreeNode;
		parentId: string | null;
		level: number;
		index: number;
		setSize: number;
		ancestors: string[];
	};

	type DropPosition = 'before' | 'after' | 'inside';

	let {
		nodes,
		expandedIds = $bindable([]),
		selectedIds = $bindable([]),
		checkedIds = $bindable([]),
		selectionMode = 'none',
		checkable = false,
		cascade = true,
		draggable = false,
		ariaLabel = 'Tree',
		empty,
		node: nodeSnippet,
		onExpandedChange,
		onSelectionChange,
		onCheckedChange,
		onSelect,
		onMove,
		class: className,
		rowClass,
	}: Props = $props();

	let treeElement = $state<HTMLDivElement | null>(null);
	let focusedId = $state<string | null>(null);
	let draggedId = $state<string | null>(null);
	let dropTarget = $state<{ id: string; position: DropPosition } | null>(null);

	const canDrag = $derived(draggable && Boolean(onMove));
	const selectedSet = $derived(new SvelteSet(selectedIds));

	function buildIndex(
		list: TreeNode[],
		parentId: string | null,
		level: number,
		ancestors: string[],
		map: Map<string, IndexedNode>,
	): void {
		list.forEach((node, index) => {
			map.set(node.id, { node, parentId, level, index, setSize: list.length, ancestors });
			if (node.children) {
				buildIndex(node.children, node.id, level + 1, [...ancestors, node.id], map);
			}
		});
	}

	const indexedNodes = $derived.by(() => {
		const map = new SvelteMap<string, IndexedNode>();
		buildIndex(nodes, null, 0, [], map);
		return map;
	});

	const visibleNodes = $derived.by(() => {
		const expandedSet = new SvelteSet(expandedIds);
		const visible: IndexedNode[] = [];

		function visit(
			list: TreeNode[],
			parentId: string | null,
			level: number,
			ancestors: string[],
		): void {
			list.forEach((node, index) => {
				visible.push({ node, parentId, level, index, setSize: list.length, ancestors });
				if (node.children?.length && expandedSet.has(node.id)) {
					visit(node.children, node.id, level + 1, [...ancestors, node.id]);
				}
			});
		}

		visit(nodes, null, 0, []);
		return visible;
	});

	const checkedStates = $derived.by(() => {
		const checkedSet = new SvelteSet(checkedIds);
		const states = new SvelteMap<string, TreeCheckState>();

		function visit(node: TreeNode): boolean {
			const hasCheckedChild = (node.children ?? []).map(visit).some(Boolean);
			const ownChecked = checkedSet.has(node.id);
			let state: TreeCheckState = ownChecked ? 'checked' : 'unchecked';
			if (!ownChecked && cascade && hasCheckedChild) state = 'indeterminate';
			states.set(node.id, state);
			return ownChecked || hasCheckedChild;
		}

		nodes.forEach(visit);
		return states;
	});

	const focusableId = $derived.by(() => {
		if (focusedId && visibleNodes.some(({ node }) => node.id === focusedId)) {
			return focusedId;
		}
		return visibleNodes[0]?.node.id ?? null;
	});

	function getCheckState(node: TreeNode): TreeCheckState {
		return checkedStates.get(node.id) ?? 'unchecked';
	}

	function getAriaChecked(node: TreeNode): boolean | 'mixed' {
		const state = getCheckState(node);
		if (state === 'indeterminate') return 'mixed';
		return state === 'checked';
	}

	function getSlotProps(node: TreeNode, info: IndexedNode): TreeViewSlotProps {
		return {
			node,
			level: info.level,
			expanded: expandedIds.includes(node.id),
			selected: selectedSet.has(node.id),
			checked: getCheckState(node),
		};
	}

	function getRowStateClass(node: TreeNode, isSelected: boolean): string {
		if (node.disabled) return 'opacity-50';
		if (isSelected) return 'bg-accent text-accent-foreground';
		return 'hover:bg-accent/50';
	}

	function emitExpanded(next: string[]): void {
		expandedIds = next;
		onExpandedChange?.(next);
	}

	function toggleExpanded(node: TreeNode): void {
		if (!node.children?.length) return;
		const next = expandedIds.includes(node.id)
			? expandedIds.filter((id) => id !== node.id)
			: [...expandedIds, node.id];
		emitExpanded(next);
	}

	function emitSelection(next: string[]): void {
		selectedIds = next;
		onSelectionChange?.(next);
	}

	function selectNode(node: TreeNode): void {
		if (node.disabled) return;
		if (selectionMode === 'none') {
			onSelect?.(node);
			return;
		}

		let next: string[];
		if (selectionMode === 'single') {
			next = [node.id];
		} else if (selectedSet.has(node.id)) {
			next = selectedIds.filter((id) => id !== node.id);
		} else {
			next = [...selectedIds, node.id];
		}

		emitSelection(next);
		onSelect?.(node);
	}

	function collectDescendants(node: TreeNode): TreeNode[] {
		return (node.children ?? []).flatMap((child) => [child, ...collectDescendants(child)]);
	}

	function normalizeAncestors(checkedSet: Set<string>, nodeId: string): void {
		const ancestors = indexedNodes.get(nodeId)?.ancestors ?? [];
		for (const ancestorId of [...ancestors].reverse()) {
			const ancestor = indexedNodes.get(ancestorId);
			if (!ancestor) continue;
			const childIds = ancestor.node.children?.map((child) => child.id) ?? [];
			if (childIds.length > 0 && childIds.every((id) => checkedSet.has(id))) {
				checkedSet.add(ancestorId);
			} else {
				checkedSet.delete(ancestorId);
			}
		}
	}

	function orderedCheckedIds(checkedSet: Set<string>): string[] {
		return [...indexedNodes.keys()].filter((id) => checkedSet.has(id));
	}

	function setChecked(node: TreeNode, checked: boolean): void {
		if (node.disabled) return;

		const next = new SvelteSet(checkedIds);
		const affected = cascade ? [node, ...collectDescendants(node)] : [node];
		for (const affectedNode of affected) {
			if (checked) next.add(affectedNode.id);
			else next.delete(affectedNode.id);
		}

		if (cascade) normalizeAncestors(next, node.id);

		checkedIds = orderedCheckedIds(next);
		onCheckedChange?.(checkedIds);
	}

	function toggleChecked(node: TreeNode): void {
		setChecked(node, getCheckState(node) !== 'checked');
	}

	function handleRowClick(node: TreeNode): void {
		if (node.disabled) return;
		if (checkable && selectionMode === 'none') {
			toggleChecked(node);
			return;
		}
		selectNode(node);
	}

	function handleCheckClick(event: MouseEvent, node: TreeNode): void {
		event.stopPropagation();
		toggleChecked(node);
	}

	function handleExpandClick(event: MouseEvent, node: TreeNode): void {
		event.stopPropagation();
		toggleExpanded(node);
	}

	async function focusNode(id: string): Promise<void> {
		focusedId = id;
		await tick();
		const row = treeElement?.querySelector<HTMLElement>(`[data-tree-node-id="${CSS.escape(id)}"]`);
		row?.focus();
	}

	async function handleKeydown(event: KeyboardEvent, info: IndexedNode): Promise<void> {
		const index = visibleNodes.findIndex(({ node }) => node.id === info.node.id);
		const isExpanded = expandedIds.includes(info.node.id);
		const hasChildren = Boolean(info.node.children?.length);

		switch (event.key) {
			case 'ArrowDown': {
				if (index < visibleNodes.length - 1) {
					event.preventDefault();
					await focusNode(visibleNodes[index + 1].node.id);
				}
				break;
			}
			case 'ArrowUp': {
				if (index > 0) {
					event.preventDefault();
					await focusNode(visibleNodes[index - 1].node.id);
				}
				break;
			}
			case 'Home': {
				if (visibleNodes.length > 0) {
					event.preventDefault();
					await focusNode(visibleNodes[0].node.id);
				}
				break;
			}
			case 'End': {
				if (visibleNodes.length > 0) {
					event.preventDefault();
					await focusNode(visibleNodes[visibleNodes.length - 1].node.id);
				}
				break;
			}
			case 'ArrowRight': {
				if (hasChildren) {
					event.preventDefault();
					if (!isExpanded) toggleExpanded(info.node);
					else await focusNode(info.node.children![0].id);
				}
				break;
			}
			case 'ArrowLeft': {
				if (hasChildren && isExpanded) {
					event.preventDefault();
					toggleExpanded(info.node);
				} else if (info.parentId) {
					event.preventDefault();
					await focusNode(info.parentId);
				}
				break;
			}
			case 'Enter': {
				if (info.node.disabled) return;
				if (selectionMode !== 'none') {
					event.preventDefault();
					selectNode(info.node);
				} else if (hasChildren) {
					event.preventDefault();
					toggleExpanded(info.node);
				} else {
					event.preventDefault();
					onSelect?.(info.node);
				}
				break;
			}
			case ' ': {
				if (info.node.disabled) return;
				event.preventDefault();
				if (checkable) toggleChecked(info.node);
				else selectNode(info.node);
				break;
			}
		}
	}

	function isAncestor(ancestorId: string, nodeId: string): boolean {
		return indexedNodes.get(nodeId)?.ancestors.includes(ancestorId) ?? false;
	}

	function getDropPosition(event: DragEvent, info: IndexedNode): DropPosition {
		const row = event.currentTarget as HTMLElement;
		const rect = row.getBoundingClientRect();
		const offset = event.clientY - rect.top;
		if (info.node.children?.length && offset > rect.height * 0.25 && offset < rect.height * 0.75) {
			return 'inside';
		}
		return offset < rect.height / 2 ? 'before' : 'after';
	}

	function isInteractiveDragTarget(target: EventTarget | null): boolean {
		return (
			target instanceof Element && Boolean(target.closest('button, a, input, textarea, select'))
		);
	}

	function handleDragStart(event: DragEvent, node: TreeNode): void {
		if (!canDrag || node.disabled || isInteractiveDragTarget(event.target)) {
			event.preventDefault();
			return;
		}
		draggedId = node.id;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', node.id);
		}
	}

	function handleDragEnd(): void {
		draggedId = null;
		dropTarget = null;
	}

	function handleDragOver(event: DragEvent, info: IndexedNode): void {
		if (!canDrag || !draggedId || info.node.disabled || draggedId === info.node.id) return;
		if (isAncestor(draggedId, info.node.id)) return;

		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
		dropTarget = { id: info.node.id, position: getDropPosition(event, info) };
	}

	function handleDragLeave(event: DragEvent, info: IndexedNode): void {
		if (dropTarget?.id !== info.node.id) return;
		const related = event.relatedTarget;
		if (related instanceof Node && (event.currentTarget as HTMLElement).contains(related)) return;
		dropTarget = null;
	}

	function buildMove(
		sourceId: string,
		target: IndexedNode,
		position: DropPosition,
	): TreeNodeMove | null {
		const source = indexedNodes.get(sourceId);
		if (!source || sourceId === target.node.id || target.node.disabled) return null;
		if (isAncestor(sourceId, target.node.id)) return null;

		if (position === 'inside') {
			if (!target.node.children?.length) return null;
			return { id: sourceId, parentId: target.node.id, index: target.node.children.length };
		}

		let index = target.index + (position === 'after' ? 1 : 0);
		if (source.parentId === target.parentId && source.index < index) index -= 1;
		if (source.parentId === target.parentId && source.index === index) return null;

		return { id: sourceId, parentId: target.parentId, index };
	}

	function handleDrop(event: DragEvent, info: IndexedNode): void {
		if (!canDrag || !draggedId) return;
		event.preventDefault();

		const position =
			dropTarget?.id === info.node.id ? dropTarget.position : getDropPosition(event, info);
		const move = buildMove(draggedId, info, position);

		if (move) {
			if (position === 'inside' && !expandedIds.includes(info.node.id)) {
				emitExpanded([...expandedIds, info.node.id]);
			}
			onMove?.(move);
		}

		handleDragEnd();
	}
</script>

<div
	bind:this={treeElement}
	role={visibleNodes.length > 0 ? 'tree' : undefined}
	aria-label={visibleNodes.length > 0 ? ariaLabel : undefined}
	aria-multiselectable={visibleNodes.length > 0 && selectionMode === 'multiple' ? true : undefined}
	data-slot="tree-view"
	class={cls('w-full text-sm', className)}
>
	{#if visibleNodes.length === 0}
		<div class="p-3 text-sm text-muted-foreground">
			{#if empty}
				{@render empty()}
			{:else}
				No items
			{/if}
		</div>
	{:else}
		{#each visibleNodes as info (info.node.id)}
			{@const isExpanded = expandedIds.includes(info.node.id)}
			{@const hasChildren = Boolean(info.node.children?.length)}
			{@const isSelected = selectedSet.has(info.node.id)}
			{@const checkState = getCheckState(info.node)}
			{@const activeDrop = dropTarget?.id === info.node.id ? dropTarget.position : null}
			<div
				role="treeitem"
				tabindex={focusableId === info.node.id ? 0 : -1}
				aria-level={info.level + 1}
				aria-setsize={info.setSize}
				aria-posinset={info.index + 1}
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-selected={selectionMode !== 'none' ? isSelected : undefined}
				aria-checked={checkable ? getAriaChecked(info.node) : undefined}
				aria-disabled={info.node.disabled || undefined}
				data-slot="tree-view-item"
				data-tree-node-id={info.node.id}
				data-selected={isSelected || undefined}
				data-expanded={isExpanded || undefined}
				data-drop-position={activeDrop ?? undefined}
				class={cls(
					'relative flex w-full items-center gap-2 rounded-md py-1.5 pe-2 text-left transition-colors outline-none select-none',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
					canDrag && !info.node.disabled && 'active:cursor-grabbing',
					getRowStateClass(info.node, isSelected),
					activeDrop === 'inside' && 'bg-accent text-accent-foreground ring-1 ring-ring',
					rowClass,
				)}
				draggable={canDrag && !info.node.disabled}
				style:padding-inline-start={`calc(${info.level} * 1.25rem + 0.5rem)`}
				onclick={() => handleRowClick(info.node)}
				onkeydown={(event) => void handleKeydown(event, info)}
				onfocus={() => (focusedId = info.node.id)}
				ondragstart={(event) => handleDragStart(event, info.node)}
				ondragend={handleDragEnd}
				ondragover={(event) => handleDragOver(event, info)}
				ondragleave={(event) => handleDragLeave(event, info)}
				ondrop={(event) => handleDrop(event, info)}
			>
				{#if activeDrop === 'before'}
					<span
						aria-hidden="true"
						data-slot="tree-view-drop-indicator"
						class="pointer-events-none absolute inset-x-2 top-0 h-0.5 rounded-full bg-brand"
					></span>
				{/if}
				{#if activeDrop === 'after'}
					<span
						aria-hidden="true"
						data-slot="tree-view-drop-indicator"
						class="pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand"
					></span>
				{/if}

				{#if hasChildren}
					<button
						type="button"
						tabindex="-1"
						aria-label={isExpanded ? `Collapse ${info.node.label}` : `Expand ${info.node.label}`}
						data-slot="tree-view-expand"
						class="flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
						onclick={(event) => handleExpandClick(event, info.node)}
					>
						<ChevronRightIcon
							class={cls(
								'size-3.5 transition-transform duration-150 motion-reduce:transition-none',
								isExpanded && 'rotate-90',
							)}
						/>
					</button>
				{:else}
					<span class="size-4 shrink-0" aria-hidden="true"></span>
				{/if}

				{#if checkable}
					<button
						type="button"
						tabindex="-1"
						disabled={info.node.disabled}
						aria-label={`Toggle ${info.node.label}`}
						data-slot="tree-view-checkbox"
						data-state={checkState}
						class={cls(
							'flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-colors motion-reduce:transition-none',
							checkState === 'checked' || checkState === 'indeterminate'
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-input bg-background',
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
						)}
						onclick={(event) => handleCheckClick(event, info.node)}
					>
						{#if checkState === 'indeterminate'}
							<MinusIcon class="size-3.5" />
						{:else if checkState === 'checked'}
							<CheckIcon class="size-3.5" />
						{/if}
					</button>
				{/if}

				{#if nodeSnippet}
					<span class="min-w-0 flex-1">
						{@render nodeSnippet(getSlotProps(info.node, info))}
					</span>
				{:else}
					{#if info.node.icon}
						{@const Icon = info.node.icon}
						<Icon class="size-4 shrink-0 text-muted-foreground" />
					{/if}
					<span class="min-w-0 flex-1 truncate">{info.node.label}</span>
				{/if}
			</div>
		{/each}
	{/if}
</div>
