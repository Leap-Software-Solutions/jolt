<script lang="ts">
	import HoverCard from './hover-card.svelte';
</script>

<HoverCard openDelay={0}>
	{#snippet trigger(props)}
		<a {...props} href="#profile">Ada Lovelace</a>
	{/snippet}

	<p>Engineer profile</p>
</HoverCard>
