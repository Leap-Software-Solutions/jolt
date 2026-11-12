<script lang="ts">
	import Popover from './popover.svelte';

	let open = $state(false);
</script>

<Popover bind:open>
	{#snippet trigger(props)}
		<button {...props} type="button">Open popover</button>
	{/snippet}
	<p>Popover body</p>
</Popover>
<span data-testid="open">{open}</span>
