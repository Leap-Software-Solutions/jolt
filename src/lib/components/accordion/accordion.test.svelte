<script lang="ts">
	import Accordion from './accordion.svelte';

	const items = [
		{ value: 'shipping', title: 'Shipping', content: 'Shipping content' },
		{ value: 'returns', title: 'Returns', content: 'Returns content' },
	];

	let value = $state('');
</script>

<Accordion {items} bind:value />
<span data-testid="value">{value}</span>
