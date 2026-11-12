<script lang="ts" module>
	import { PencilIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './button.svelte';

	const { Story } = defineMeta({
		title: 'Actions/Button',
		component: Button,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'brand', 'link'],
			},
			size: {
				control: 'select',
				options: ['sm', 'default', 'lg', 'icon'],
			},
		},
	});
</script>

<Story name="Default">Save changes</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Save changes</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Save changes</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Save changes</Story>

<Story name="Destructive" args={{ variant: 'destructive' }}>Delete asset</Story>

<Story name="Brand" args={{ variant: 'brand' }}>Start now</Story>

<Story name="Link" args={{ variant: 'link', href: '#' }}>Read the docs</Story>

<Story name="Small" args={{ size: 'sm' }}>Save changes</Story>

<Story name="Large" args={{ size: 'lg' }}>Save changes</Story>

<Story name="Icon" args={{ size: 'icon', 'aria-label': 'Edit' }}>
	<PencilIcon />
</Story>

<Story name="Disabled" args={{ disabled: true }}>Save changes</Story>
