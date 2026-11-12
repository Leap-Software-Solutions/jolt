<script lang="ts">
	import Combobox from './combobox.svelte';

	type Engineer = {
		id: string;
		name: string;
	};

	const engineers: Engineer[] = [
		{ id: 'ada', name: 'Ada Lovelace' },
		{ id: 'grace', name: 'Grace Hopper' },
		{ id: 'alan', name: 'Alan Turing' },
	];

	let { value = $bindable<Engineer | undefined>() }: { value?: Engineer } = $props();
</script>

<Combobox
	items={engineers}
	bind:value
	getKey={(engineer) => engineer.id}
	getLabel={(engineer) => engineer.name}
	ariaLabel="Engineer"
	placeholder="Search engineers"
/>
<span data-testid="value">{value?.name ?? 'none'}</span>
