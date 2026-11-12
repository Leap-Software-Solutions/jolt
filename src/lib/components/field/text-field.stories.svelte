<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextField from './text-field.svelte';
	import type { TextFieldProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/TextField',
		component: TextField,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Email',
			placeholder: 'ada@leap-online.com',
			type: 'email',
		},
	});

	type TemplateArgs = TextFieldProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<TextField {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With hint" args={{ hint: 'We only use this for account updates.' }} {template} />

<Story name="With value" args={{ value: 'ada@leap-online.com' }} {template} />

<Story
	name="Invalid"
	args={{ value: 'not-an-email', error: 'Enter a valid email address.' }}
	{template}
/>

<Story name="Required" args={{ required: true }} {template} />

<Story name="Disabled" args={{ value: 'ada@leap-online.com', disabled: true }} {template} />

<Story name="Number" args={{ label: 'Team size', type: 'number', placeholder: '24' }} {template} />
