<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as CheckboxProps } from './checkbox.svelte';
	import Checkbox from './checkbox.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Checkbox',
		component: Checkbox,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Email me about product updates',
		},
	});

	type TemplateArgs = CheckboxProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<Checkbox {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Checked" args={{ checked: true }} {template} />

<Story
	name="With description"
	args={{
		label: 'Email me about product updates',
		description: 'No more than one message per week.',
	}}
	{template}
/>

<Story name="Indeterminate" args={{ indeterminate: true }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Disabled checked" args={{ checked: true, disabled: true }} {template} />
