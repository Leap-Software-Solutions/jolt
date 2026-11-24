<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as SplitButtonProps } from './split-button.svelte';
	import SplitButton from './split-button.svelte';

	const items: SplitButtonProps['items'] = [
		{ label: 'Save as draft', onSelect: () => {} },
		{ type: 'separator' },
		{ label: 'Save and publish', onSelect: () => {} },
	];

	const { Story } = defineMeta({
		title: 'Actions/Split Button',
		component: SplitButton,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Save',
			items,
			menuLabel: 'More save options',
		},
	});
</script>

{#snippet template(args: SplitButtonProps)}
	<SplitButton {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="Outline" args={{ variant: 'outline' }} {template} />

<Story name="Secondary" args={{ variant: 'secondary' }} {template} />

<Story name="Ghost" args={{ variant: 'ghost' }} {template} />

<Story name="Small" args={{ size: 'sm' }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
