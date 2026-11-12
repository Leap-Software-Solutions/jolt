<script lang="ts" module>
	import { BellIcon, SettingsIcon, UserIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { TabsItem } from './tabs.svelte';
	import Tabs from './tabs.svelte';

	const accountTabs: TabsItem[] = [
		{ value: 'overview', label: 'Overview', icon: UserIcon },
		{ value: 'activity', label: 'Activity', icon: BellIcon },
		{ value: 'settings', label: 'Settings', icon: SettingsIcon },
		{ value: 'billing', label: 'Billing', icon: SettingsIcon, disabled: true },
	];

	const plainTabs: TabsItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' },
		{ value: 'settings', label: 'Settings' },
	];

	const { Story } = defineMeta({
		title: 'Navigation/Tabs',
		component: Tabs,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: accountTabs,
			ariaLabel: 'Account sections',
		},
	});
</script>

<script lang="ts">
	import type { Props as TabsProps } from './tabs.svelte';

	let value = $state('overview');

	type TemplateArgs = Omit<TabsProps, 'items' | 'value'> & {
		items?: TabsItem[];
	};
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-[32rem] max-w-full gap-2">
		<Tabs items={args.items ?? accountTabs} bind:value {...args}>
			{#snippet content(item)}
				<div class="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
					{item.label} content for <span class="font-medium text-foreground">{value}</span>.
				</div>
			{/snippet}
		</Tabs>
		<p class="text-xs text-muted-foreground">Active tab: {value}</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Plain" args={{ items: plainTabs }} {template} />

<Story name="Vertical" args={{ orientation: 'vertical' }} {template} />

<Story name="Manual activation" args={{ activationMode: 'manual' }} {template} />
