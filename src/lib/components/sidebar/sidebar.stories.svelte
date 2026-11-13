<script lang="ts" module>
	import { FolderKanban, House, Settings, Users } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sidebar from './sidebar.svelte';
	import type { Props as SidebarProps, SidebarGroup } from './types.js';

	const groups: SidebarGroup[] = [
		{
			label: 'Workspace',
			items: [
				{ label: 'Home', href: '#', icon: House },
				{ label: 'Projects', href: '#', icon: FolderKanban, active: true },
				{ label: 'Engineers', href: '#', icon: Users, badge: '8' },
			],
		},
		{
			label: 'Account',
			items: [{ label: 'Settings', href: '#', icon: Settings }],
		},
	];

	const { Story } = defineMeta({
		title: 'Layout/Sidebar',
		component: Sidebar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			groups,
			collapsed: false,
		},
	});
</script>

{#snippet template(args: Omit<SidebarProps, 'header' | 'footer'>)}
	<div class="h-[32rem] overflow-hidden rounded-xl border bg-background">
		<Sidebar {...args}>
			{#snippet header({ collapsed })}
				<div class="flex h-10 items-center gap-2 rounded-md px-2.5">
					<span
						class="flex size-6 items-center justify-center rounded-md bg-brand text-xs font-bold text-brand-foreground"
					>
						J
					</span>
					{#if !collapsed}
						<span class="font-semibold">Jolt</span>
					{/if}
				</div>
			{/snippet}

			{#snippet footer({ collapsed })}
				<div class="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground">
					<span class="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
						AL
					</span>
					{#if !collapsed}
						<span class="truncate">Ada Lovelace</span>
					{/if}
				</div>
			{/snippet}
		</Sidebar>
	</div>
{/snippet}

<Story name="Default" {template} />
