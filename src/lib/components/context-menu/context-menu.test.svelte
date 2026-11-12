<script lang="ts">
	import ContextMenu from './context-menu.svelte';

	let lastAction = $state('');

	const items = [
		{ label: 'Edit', onSelect: () => (lastAction = 'edit') },
		{ label: 'Duplicate', onSelect: () => (lastAction = 'duplicate') },
	];
</script>

<ContextMenu {items}>
	{#snippet trigger(props)}
		<div {...props} data-testid="context-menu-trigger">Right-click this card</div>
	{/snippet}
</ContextMenu>

<span data-testid="last-action">{lastAction}</span>
