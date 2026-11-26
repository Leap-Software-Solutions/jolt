<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as UserChipProps } from './types.js';
	import UserChip from './user-chip.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/User Chip',
		component: UserChip,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			name: 'Ada Lovelace',
			initials: 'AL',
		},
	});

	type TemplateArgs = UserChipProps;
</script>

{#snippet template(args: TemplateArgs)}
	<UserChip {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="With meta" args={{ meta: 'Staff engineer' }} {template} />

<Story name="Presence" args={{ status: 'online' }} {template} />

<Story name="Large" args={{ size: 'lg' }} {template} />

<Story name="Removable" args={{ onRemove: () => {} }} {template} />
