<script lang="ts" module>
	import { FilePlus, FolderOpen, Search, Settings } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import CommandPalette, {
		type CommandPaletteGroup,
		type Props as CommandPaletteProps,
	} from './command-palette.svelte';

	const groups: CommandPaletteGroup[] = [
		{
			heading: 'Navigation',
			items: [
				{ value: 'open-project', label: 'Open project', icon: FolderOpen, shortcut: 'O' },
				{ value: 'search', label: 'Search', icon: Search, shortcut: '/' },
			],
		},
		{
			heading: 'Actions',
			items: [
				{ value: 'new-project', label: 'New project', icon: FilePlus, shortcut: 'N' },
				{ value: 'settings', label: 'Settings', icon: Settings, shortcut: ',' },
			],
		},
	];

	const { Story } = defineMeta({
		title: 'Overlays/Command Palette',
		component: CommandPalette,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			groups,
			title: 'Command palette',
		},
	});

	type TemplateArgs = Omit<CommandPaletteProps, 'trigger' | 'open'>;
</script>

<script lang="ts">
	let open = $state(false);
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid justify-items-center gap-3">
		<CommandPalette bind:open {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="outline">Open command palette</Button>
			{/snippet}
		</CommandPalette>
		<p class="text-xs text-muted-foreground">Search, then press Enter to run a command.</p>
	</div>
{/snippet}

<Story name="Default" {template} />
