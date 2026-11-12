<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import Select from './select.svelte';
	import type { Props as SelectProps, SelectItem } from './types.js';

	const SelectString = Select as unknown as Component<SelectProps<string>>;

	const statuses: SelectItem<string>[] = [
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'archived', label: 'Archived', disabled: true },
	];

	const departments: SelectItem<string>[] = [
		'Design',
		'Engineering',
		'Finance',
		'Marketing',
		'Operations',
		'People',
		'Sales',
		'Support',
	].map((label) => ({ value: label.toLowerCase(), label }));

	const { Story } = defineMeta({
		title: 'Forms/Select',
		component: SelectString,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			items: statuses,
			ariaLabel: 'Status',
			placeholder: 'Select a status',
		},
	});
</script>

<script lang="ts">
	let value = $state('active');

	type TemplateArgs = Omit<SelectProps<string>, 'items' | 'value'> & {
		items?: SelectItem<string>[];
	};
	type CustomArgs = Omit<SelectProps<string>, 'items' | 'value' | 'item'>;
	type EmptyArgs = Omit<SelectProps<string>, 'items' | 'value' | 'empty'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-64 gap-2">
		<Select items={args.items ?? statuses} bind:value {...args} />
		<p class="text-xs text-muted-foreground">Selected: {value || 'none'}</p>
	</div>
{/snippet}

{#snippet customTemplate(args: CustomArgs)}
	<div class="grid w-64 gap-2">
		<Select items={statuses} bind:value {...args}>
			{#snippet item(entry)}
				<span class="flex items-center gap-2">
					<span class="size-2 rounded-full bg-brand"></span>
					{entry.label}
				</span>
			{/snippet}
		</Select>
		<p class="text-xs text-muted-foreground">Selected: {value || 'none'}</p>
	</div>
{/snippet}

{#snippet emptyTemplate(args: EmptyArgs)}
	<div class="w-64">
		<Select {...args} items={[]} bind:value>
			{#snippet empty()}
				No statuses yet.
			{/snippet}
		</Select>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story
	name="Scrollable"
	args={{ items: departments, placeholder: 'Select a department', ariaLabel: 'Department' }}
	{template}
/>

<Story name="Custom item" template={customTemplate} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Empty" template={emptyTemplate} />
