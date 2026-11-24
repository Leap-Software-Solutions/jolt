<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { AvatarStatus } from '../avatar/index.js';
	import type { AvatarGroupItem, Props as AvatarGroupProps } from './avatar-group.svelte';
	import AvatarGroup from './avatar-group.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Avatar Group',
		component: AvatarGroup,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});

	const statuses: AvatarStatus[] = ['online', 'away', 'busy', 'offline'];

	const engineers: AvatarGroupItem[] = [
		{ src: 'https://i.pravatar.cc/100?img=12', alt: 'Ada Lovelace' },
		{ src: 'https://i.pravatar.cc/100?img=32', alt: 'Grace Hopper' },
		{ src: 'https://i.pravatar.cc/100?img=45', alt: 'Katherine Johnson' },
		{ src: 'https://i.pravatar.cc/100?img=5', alt: 'Margaret Hamilton' },
		{ src: 'https://i.pravatar.cc/100?img=9', alt: 'Dorothy Vaughan' },
		{ src: 'https://i.pravatar.cc/100?img=20', alt: 'Annie Easley' },
	];

	const presenceItems: AvatarGroupItem[] = engineers.slice(0, 4).map((engineer, index) => ({
		...engineer,
		status: statuses[index],
	}));

	type TemplateArgs = Omit<AvatarGroupProps, 'items'>;
</script>

{#snippet template(args: TemplateArgs)}
	<AvatarGroup items={engineers} {...args} />
{/snippet}

{#snippet presenceTemplate()}
	<AvatarGroup items={presenceItems} max={4} ariaLabel="People viewing this retro" />
{/snippet}

<Story name="Default" {template} />

<Story name="With overflow" args={{ max: 4 }} {template} />

<Story name="Small" args={{ max: 5, size: 'sm' }} {template} />

<Story name="All people" args={{ max: 6, ariaLabel: 'Engineers on the project' }} {template} />

<Story name="Presence" asChild>
	{@render presenceTemplate()}
</Story>
