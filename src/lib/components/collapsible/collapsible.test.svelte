<script lang="ts">
	import Collapsible from './collapsible.svelte';

	let open = $state(false);
</script>

<Collapsible bind:open label="Details">
	<p>Hidden details</p>
</Collapsible>
<span data-testid="open">{open}</span>
