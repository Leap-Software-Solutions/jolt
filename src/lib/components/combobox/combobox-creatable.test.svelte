<script lang="ts">
	import Combobox from './combobox.svelte';
	import type { Props as ComboboxProps } from './types.js';

	type Engineer = {
		id: string;
		name: string;
		pending?: boolean;
	};

	const engineers: Engineer[] = [
		{ id: 'ada', name: 'Ada Lovelace' },
		{ id: 'grace', name: 'Grace Hopper' },
	];

	type Props = Omit<ComboboxProps<Engineer>, 'items' | 'getKey' | 'getLabel' | 'ariaLabel'>;

	let { value = $bindable(), ...rest }: Props = $props();
</script>

<Combobox
	items={engineers}
	bind:value
	getKey={(engineer) => engineer.id}
	getLabel={(engineer) => engineer.name}
	ariaLabel="Assign action item"
	placeholder="Assign action item"
	{...rest}
/>
<span data-testid="value">{value ? `${value.name}:${value.pending ?? false}` : 'none'}</span>
