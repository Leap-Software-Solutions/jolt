<script lang="ts">
	import type { DropdownMenuEntry } from './dropdown-menu.svelte';
	import DropdownMenu from './dropdown-menu.svelte';

	let lastAction = $state('none');

	const items: DropdownMenuEntry[] = [
		{
			label: 'Edit',
			onSelect: () => (lastAction = 'edit'),
		},
		{ type: 'separator' },
		{
			label: 'Delete',
			variant: 'destructive',
			onSelect: () => (lastAction = 'delete'),
		},
	];
</script>

<DropdownMenu {items}>
	{#snippet trigger(props)}
		<button {...props} type="button">Actions</button>
	{/snippet}
</DropdownMenu>
<span data-testid="action">{lastAction}</span>
