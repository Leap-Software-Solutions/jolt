<script lang="ts" module>
	import { CopyIcon, EllipsisIcon, PencilIcon, SettingsIcon, TrashIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { DropdownMenuEntry } from './dropdown-menu.svelte';
	import DropdownMenu from './dropdown-menu.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Dropdown Menu',
		component: DropdownMenu,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	import type { DropdownMenuAlign, DropdownMenuSide } from './dropdown-menu.svelte';

	let notifications = $state(true);
	let theme = $state('system');
	let lastAction = $state('None');

	const menuItems = $derived.by((): DropdownMenuEntry[] => {
		return [
			{
				label: 'Edit',
				icon: PencilIcon,
				shortcut: 'E',
				onSelect: () => (lastAction = 'Edit'),
			},
			{
				label: 'Duplicate',
				icon: CopyIcon,
				shortcut: 'D',
				onSelect: () => (lastAction = 'Duplicate'),
			},
			{ type: 'separator' },
			{
				type: 'group',
				label: 'Preferences',
				items: [
					{
						type: 'checkbox',
						label: 'Notifications',
						checked: notifications,
						closeOnSelect: false,
						onCheckedChange: (checked) => {
							notifications = checked;
							lastAction = `Notifications: ${checked ? 'on' : 'off'}`;
						},
					},
					{
						type: 'submenu',
						label: 'Theme',
						icon: SettingsIcon,
						items: [
							{
								type: 'radio',
								value: theme,
								onValueChange: (nextTheme) => {
									theme = nextTheme;
									lastAction = `Theme: ${nextTheme}`;
								},
								items: [
									{ value: 'light', label: 'Light', closeOnSelect: false },
									{ value: 'dark', label: 'Dark', closeOnSelect: false },
									{ value: 'system', label: 'System', closeOnSelect: false },
								],
							},
						],
					},
				],
			},
			{ type: 'separator' },
			{
				label: 'Delete',
				icon: TrashIcon,
				variant: 'destructive',
				shortcut: '⌫',
				onSelect: () => (lastAction = 'Delete'),
			},
		];
	});

	type TemplateArgs = {
		align?: DropdownMenuAlign;
		side?: DropdownMenuSide;
	};
</script>

{#snippet template(args: TemplateArgs)}
	<div class="flex flex-col items-center gap-3">
		<DropdownMenu items={menuItems} {...args}>
			{#snippet trigger(props)}
				<button
					{...props}
					type="button"
					class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
				>
					<EllipsisIcon class="size-4" />
					Actions
				</button>
			{/snippet}
		</DropdownMenu>
		<p class="text-xs text-muted-foreground">Last action: {lastAction}</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Start aligned" args={{ align: 'start' }} {template} />

<Story name="Top" args={{ side: 'top' }} {template} />
