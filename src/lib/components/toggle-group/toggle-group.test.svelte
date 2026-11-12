<script lang="ts">
	import ToggleGroup from './toggle-group.svelte';

	const items = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' },
	];

	let value = $state('left');
</script>

<ToggleGroup {items} bind:value ariaLabel="Alignment" />
<span data-testid="value">{value}</span>
