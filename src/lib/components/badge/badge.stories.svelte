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
				options: [
					'default',
					'secondary',
					'outline',
					'brand',
					'destructive',
					'neutral',
					'info',
					'success',
					'warning',
					'danger',
				],
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

<Story name="Neutral" args={{ variant: 'neutral', label: 'Unknown' }} />

<Story name="Info" args={{ variant: 'info', label: 'Queued' }} />

<Story name="Success" args={{ variant: 'success', label: 'Passed' }} />

<Story name="Warning" args={{ variant: 'warning', label: 'Delayed' }} />

<Story name="Danger" args={{ variant: 'danger', label: 'Failed' }} />

<Story name="With dot" args={{ variant: 'success', label: 'Connected', dot: true }} />
