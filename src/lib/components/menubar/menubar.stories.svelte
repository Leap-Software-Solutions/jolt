<script lang="ts" module>
	import { Copy, FilePlus, FolderOpen, Redo2, Save, Scissors, Undo2 } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Menubar from './menubar.svelte';
	import type { MenubarMenu, Props as MenubarProps } from './types.js';

	const menus: MenubarMenu[] = [
		{
			value: 'file',
			label: 'File',
			items: [
				{ label: 'New file', icon: FilePlus, shortcut: '⌘N' },
				{ label: 'Open...', icon: FolderOpen, shortcut: '⌘O' },
				{ type: 'separator' },
				{ label: 'Save', icon: Save, shortcut: '⌘S' },
			],
		},
		{
			value: 'edit',
			label: 'Edit',
			items: [
				{ label: 'Undo', icon: Undo2, shortcut: '⌘Z' },
				{ label: 'Redo', icon: Redo2, shortcut: '⇧⌘Z' },
				{ type: 'separator' },
				{ label: 'Cut', icon: Scissors, shortcut: '⌘X' },
				{ label: 'Copy', icon: Copy, shortcut: '⌘C' },
			],
		},
		{
			value: 'view',
			label: 'View',
			items: [
				{ type: 'checkbox', label: 'Show sidebar', checked: true },
				{ type: 'separator' },
				{
					type: 'submenu',
					label: 'Theme',
					items: [{ label: 'Light' }, { label: 'Dark' }, { label: 'System' }],
				},
			],
		},
	];

	const { Story } = defineMeta({
		title: 'Navigation/Menubar',
		component: Menubar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			menus,
		},
	});
</script>

<script lang="ts">
	let value = $state('');
</script>

{#snippet template(args: Omit<MenubarProps, 'menus' | 'value'>)}
	<Menubar {...args} {menus} bind:value />
{/snippet}

<Story name="Default" {template} />
