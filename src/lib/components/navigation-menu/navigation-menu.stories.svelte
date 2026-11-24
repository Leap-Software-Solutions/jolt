<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NavigationMenu from './navigation-menu.svelte';
	import type {
		NavigationMenuItem,
		NavigationMenuPanelItem,
		Props as NavigationMenuProps,
	} from './types.js';

	const { Story } = defineMeta({
		title: 'Navigation/Navigation Menu',
		component: NavigationMenu,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				story: {
					inline: false,
					height: '320px',
				},
			},
		},
	});
</script>

<script lang="ts">
	let value = $state('');
</script>

{#snippet guidesContent(item: NavigationMenuPanelItem)}
	<div class="grid w-80 gap-1">
		<p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{item.label}</p>
		<a href="#introduction" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Introduction</span>
			<span class="text-xs text-muted-foreground">Start with the foundations.</span>
		</a>
		<a href="#installation" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Installation</span>
			<span class="text-xs text-muted-foreground">Add Jolt to your app.</span>
		</a>
		<a href="#theming" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Theming</span>
			<span class="text-xs text-muted-foreground">Tune the tokens for your surface.</span>
		</a>
	</div>
{/snippet}

{#snippet componentsContent(item: NavigationMenuPanelItem)}
	<div class="grid w-[30rem] grid-cols-2 gap-1">
		<p class="col-span-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">{item.label}</p>
		<a href="#actions" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Actions</span>
			<span class="text-xs text-muted-foreground">Buttons, toggles, and commands.</span>
		</a>
		<a href="#forms" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Forms</span>
			<span class="text-xs text-muted-foreground">Fields, pickers, and validation.</span>
		</a>
		<a href="#overlays" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Overlays</span>
			<span class="text-xs text-muted-foreground">Dialogs, menus, and tooltips.</span>
		</a>
		<a href="#layout" class="grid gap-1 rounded-md p-2 hover:bg-accent">
			<span class="text-sm font-medium">Layout</span>
			<span class="text-xs text-muted-foreground">Application chrome and structure.</span>
		</a>
	</div>
{/snippet}

{#snippet template(args: Omit<NavigationMenuProps, 'items' | 'value'>)}
	{@const items: NavigationMenuItem[] = [
		{ value: 'guides', label: 'Guides', content: guidesContent },
		{ value: 'components', label: 'Components', content: componentsContent },
		{ value: 'docs', label: 'Docs', href: '#docs', active: true },
	]}
	<div class="w-full max-w-3xl">
		<NavigationMenu {...args} {items} bind:value />
	</div>
{/snippet}

<Story name="Default" {template} />
