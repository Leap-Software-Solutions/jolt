<script lang="ts">
	import Timeline from './timeline.svelte';
	import type { TimelineEvent, TimelineGroup } from './types.js';

	let { groups, useCustomMarker = false }: { groups: TimelineGroup[]; useCustomMarker?: boolean } =
		$props();
</script>

{#if useCustomMarker}
	<Timeline {groups}>
		{#snippet marker(event: TimelineEvent)}
			<span data-testid="custom-marker">{event.id}</span>
		{/snippet}
	</Timeline>
{:else}
	<Timeline {groups} />
{/if}
