<script lang="ts">
	import Sidebar from './sidebar.svelte';
	import type { SidebarGroup } from './types.js';

	let selected = $state('');

	const groups: SidebarGroup[] = [
		{
			label: 'Workspace',
			items: [
				{ label: 'Home', href: '#home', active: true },
				{ label: 'Settings', onSelect: () => (selected = 'settings') },
			],
		},
	];
</script>

<Sidebar {groups} />
<span data-testid="selected">{selected}</span>
