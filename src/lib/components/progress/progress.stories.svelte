<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Progress, { type Props as ProgressProps } from './progress.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Progress',
		component: Progress,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			value: 40,
			ariaLabel: 'Upload progress',
		},
	});

	type TemplateArgs = ProgressProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<Progress {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With label" args={{ label: 'Uploading assets', showValue: true }} {template} />

<Story name="Indeterminate" args={{ value: null, label: 'Preparing upload' }} {template} />

<Story
	name="Complete"
	args={{ value: 100, label: 'Upload complete', showValue: true }}
	{template}
/>

<Story
	name="Custom range"
	args={{ value: 6, min: 0, max: 8, label: 'Files processed', showValue: true }}
	{template}
/>

<Story
	name="Formatted value"
	args={{
		value: 240,
		max: 512,
		label: 'Storage used',
		showValue: true,
		formatValue: (value: number) => `${value} MB of 512 MB`,
	}}
	{template}
/>
