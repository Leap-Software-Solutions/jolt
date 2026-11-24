<script lang="ts" module>
	import { Copy, Pencil, Trash } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ContextMenuEntry } from './context-menu.svelte';
	import ContextMenu from './context-menu.svelte';

	const items: ContextMenuEntry[] = [
		{ label: 'Edit', icon: Pencil, shortcut: '⌘E' },
		{ label: 'Duplicate', icon: Copy, shortcut: '⌘D' },
		{ type: 'separator' },
		{ label: 'Delete', icon: Trash, variant: 'destructive' },
	];

	const { Story } = defineMeta({
		title: 'Overlays/Context Menu',
		component: ContextMenu,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items,
		},
	});
</script>

{#snippet template(args: { items: ContextMenuEntry[] })}
	<ContextMenu {...args}>
		{#snippet trigger(props)}
			<div
				{...props}
				class="flex h-40 w-80 items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 text-center text-sm text-muted-foreground"
			>
				Right-click this card for actions
			</div>
		{/snippet}
	</ContextMenu>
{/snippet}

<Story name="Default" {template} />
