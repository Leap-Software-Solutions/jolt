<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SeverityDot from './severity-dot.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Severity Dot',
		component: SeverityDot,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		argTypes: {
			severity: {
				control: 'select',
				options: ['critical', 'high', 'medium', 'low'],
			},
		},
		args: {
			severity: 'medium',
		},
	});
</script>

<Story name="Default" />

<Story name="Critical" args={{ severity: 'critical' }} />

<Story name="High" args={{ severity: 'high' }} />

<Story name="Medium" args={{ severity: 'medium' }} />

<Story name="Low" args={{ severity: 'low' }} />

<Story name="With label" args={{ severity: 'high', showLabel: true }} />
