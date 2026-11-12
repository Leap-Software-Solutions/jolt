<script lang="ts">
	import type { TabsItem } from './tabs.svelte';
	import Tabs from './tabs.svelte';

	const items: TabsItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' },
	];

	let value = $state('overview');
</script>

<Tabs {items} bind:value ariaLabel="Sections">
	{#snippet content(item)}
		<p>{item.label} content</p>
	{/snippet}
</Tabs>
<span data-testid="value">{value}</span>
