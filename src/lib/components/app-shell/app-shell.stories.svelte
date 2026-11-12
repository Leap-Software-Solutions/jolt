<script lang="ts" module>
	import { FolderKanban, Home, Settings, Users } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PageHeader from '../page-header/page-header.svelte';
	import Sidebar from '../sidebar/sidebar.svelte';
	import type { SidebarGroup } from '../sidebar/types.js';
	import AppShell from './app-shell.svelte';

	const groups: SidebarGroup[] = [
		{
			label: 'Workspace',
			items: [
				{ label: 'Home', href: '#', icon: Home },
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
		title: 'Layout/AppShell',
		component: AppShell,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen',
		},
	});
</script>

{#snippet template()}
	<AppShell>
		{#snippet sidebar()}
			<Sidebar {groups} />
		{/snippet}

		{#snippet header()}
			<div class="flex h-14 items-center gap-3 px-6">
				<span class="text-sm font-medium">Design system</span>
				<span class="text-xs text-muted-foreground">/</span>
				<span class="text-sm text-muted-foreground">Projects</span>
			</div>
		{/snippet}

		<div class="p-6 sm:p-8">
			<PageHeader
				title="Projects"
				description="A shared home for the work your team is shipping."
			/>
		</div>
	</AppShell>
{/snippet}

<Story name="Default" {template} />
