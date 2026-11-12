<script lang="ts">
	import MultiSelect from './multi-select.svelte';

	type Engineer = {
		id: string;
		name: string;
	};

	const engineers: Engineer[] = [
		{ id: 'ada', name: 'Ada Lovelace' },
		{ id: 'grace', name: 'Grace Hopper' },
	];

	let values = $state<Engineer[]>([]);
</script>

<MultiSelect
	items={engineers}
	bind:values
	getKey={(engineer) => engineer.id}
	getLabel={(engineer) => engineer.name}
	ariaLabel="Assign engineers"
/>

<p data-testid="selected">{values.map((engineer) => engineer.name).join(', ')}</p>
