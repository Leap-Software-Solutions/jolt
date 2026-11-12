<script lang="ts" module>
	import { CheckIcon } from '@lucide/svelte';
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
		args: {
			label: 'Active',
		},
	});
</script>

<Story name="Default" />

<Story name="Secondary" args={{ variant: 'secondary', label: 'Draft' }} />

<Story name="Outline" args={{ variant: 'outline', label: 'Archived' }} />

<Story name="Brand" args={{ variant: 'brand', label: 'New' }} />

<Story name="Destructive" args={{ variant: 'destructive', label: 'Overdue' }} />

<Story name="With icon" args={{ label: 'Verified', icon: CheckIcon }} />
