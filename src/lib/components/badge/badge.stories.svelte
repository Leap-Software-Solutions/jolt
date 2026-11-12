<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './badge.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Badge',
		component: Badge,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'secondary', 'outline', 'brand', 'destructive'],
			},
		},
	});
</script>

<Story name="Default">Active</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Draft</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Archived</Story>

<Story name="Brand" args={{ variant: 'brand' }}>New</Story>

<Story name="Destructive" args={{ variant: 'destructive' }}>Overdue</Story>
