<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextareaField from './textarea-field.svelte';
	import type { TextareaFieldProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/Textarea Field',
		component: TextareaField,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Project brief',
			placeholder: 'What are we building?',
			rows: 4,
		},
	});

	type TemplateArgs = TextareaFieldProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96">
		<TextareaField {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With hint" args={{ hint: 'A few sentences is enough to get started.' }} {template} />

<Story
	name="Invalid"
	args={{ value: 'Too short', error: 'Give us at least a sentence.' }}
	{template}
/>

<Story name="Required" args={{ required: true }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
