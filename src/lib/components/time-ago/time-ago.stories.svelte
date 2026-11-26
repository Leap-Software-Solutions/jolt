<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TimeAgo from './time-ago.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Time Ago',
		component: TimeAgo,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		},
	});
</script>

<Story name="Default" />

<Story name="Just now" args={{ date: new Date().toISOString() }} />

<Story
	name="Future"
	args={{ date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() }}
/>

<Story name="Invalid date" args={{ date: 'not-a-date' }} />
