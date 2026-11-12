<script lang="ts">
	import CommandPalette, { type CommandPaletteGroup } from './command-palette.svelte';

	let open = $state(false);
	let picked = $state('none');

	const groups: CommandPaletteGroup[] = [
		{
			heading: 'Actions',
			items: [
				{ value: 'save', label: 'Save changes', onSelect: () => (picked = 'save') },
				{ value: 'delete', label: 'Delete changes', onSelect: () => (picked = 'delete') },
			],
		},
	];
</script>

<CommandPalette bind:open {groups}>
	{#snippet trigger(props)}
		<button {...props} type="button">Open commands</button>
	{/snippet}
</CommandPalette>
<span data-testid="picked">{picked}</span>
<span data-testid="open">{open}</span>
