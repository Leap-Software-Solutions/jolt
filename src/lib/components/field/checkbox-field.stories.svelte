<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CheckboxField from './checkbox-field.svelte';
	import type { CheckboxFieldProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/CheckboxField',
		component: CheckboxField,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Email me about product updates',
		},
	});

	type TemplateArgs = CheckboxFieldProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<CheckboxField {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Checked" args={{ checked: true }} {template} />

<Story
	name="With description"
	args={{ description: 'No more than one message per week.' }}
	{template}
/>

<Story name="Invalid" args={{ error: 'Accept the terms before continuing.' }} {template} />

<Story name="Indeterminate" args={{ indeterminate: true }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
