<script lang="ts">
	import Menubar from './menubar.svelte';
	import type { MenubarMenu } from './types.js';

	let action = $state('');

	const menus: MenubarMenu[] = [
		{
			value: 'file',
			label: 'File',
			items: [
				{ label: 'New file', onSelect: () => (action = 'new') },
				{ label: 'Open', onSelect: () => (action = 'open') },
			],
		},
		{
			value: 'edit',
			label: 'Edit',
			items: [{ label: 'Undo' }],
		},
	];
</script>

<Menubar {menus} />
<span data-testid="action">{action}</span>
