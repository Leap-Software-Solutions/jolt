<script lang="ts">
	import RadioGroup from './radio-group.svelte';

	const items = [
		{ value: 'starter', label: 'Starter' },
		{ value: 'growth', label: 'Growth' },
	];

	let value = $state('starter');
</script>

<RadioGroup {items} bind:value ariaLabel="Plan" />
<span data-testid="value">{value}</span>
