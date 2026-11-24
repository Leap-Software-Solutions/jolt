<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as CopyButtonProps } from './copy-button.svelte';
	import CopyButton from './copy-button.svelte';

	const { Story } = defineMeta({
		title: 'Actions/CopyButton',
		component: CopyButton,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			value: 'https://leap.online/invite/retro-42',
			onCopy: () => {},
			onError: () => {},
		},
	});
</script>

{#snippet template(args: Omit<CopyButtonProps, 'onCopy' | 'onError'>)}
	<CopyButton {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="With label" args={{ label: 'Copy invite link' }} {template} />

<Story name="Outline" args={{ label: 'Copy invite link', variant: 'outline' }} {template} />

<Story name="Disabled" args={{ label: 'Copy invite link', disabled: true }} {template} />
