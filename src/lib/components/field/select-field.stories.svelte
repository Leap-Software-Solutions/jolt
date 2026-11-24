<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import SelectField from './select-field.svelte';
	import type { SelectFieldProps } from './types.js';

	const SelectFieldString = SelectField as unknown as Component<SelectFieldProps<string>>;

	const statuses = [
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'archived', label: 'Archived', disabled: true },
	];

	const { Story } = defineMeta({
		title: 'Forms/Select Field',
		component: SelectFieldString,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Status',
			items: statuses,
			placeholder: 'Select a status',
		},
	});

	type TemplateArgs = Omit<SelectFieldProps<string>, 'items' | 'value'> & {
		items?: SelectFieldProps<string>['items'];
	};
</script>

<script lang="ts">
	let value = $state('active');
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<SelectField {...args} items={args.items ?? statuses} bind:value />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story
	name="With hint"
	args={{ hint: 'Changing the status updates the review queue.' }}
	{template}
/>

<Story name="Invalid" args={{ error: 'Choose a status before continuing.' }} {template} />

<Story name="Required" args={{ required: true }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
