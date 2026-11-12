<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import MultiSelect from './multi-select.svelte';
	import type { Props as MultiSelectProps } from './types.js';

	type Engineer = {
		id: string;
		name: string;
		role: string;
	};

	const engineers: Engineer[] = [
		{ id: 'ada', name: 'Ada Lovelace', role: 'Engineer' },
		{ id: 'grace', name: 'Grace Hopper', role: 'Engineer' },
		{ id: 'alan', name: 'Alan Turing', role: 'Engineer' },
		{ id: 'katherine', name: 'Katherine Johnson', role: 'Analyst' },
		{ id: 'margaret', name: 'Margaret Hamilton', role: 'Engineer' },
	];

	const MultiSelectEngineer = MultiSelect as unknown as Component<MultiSelectProps<Engineer>>;

	const { Story } = defineMeta({
		title: 'Forms/MultiSelect',
		component: MultiSelectEngineer,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let values = $state<Engineer[]>([engineers[0]]);

	type TemplateArgs = Omit<MultiSelectProps<Engineer>, 'items' | 'values' | 'getKey' | 'getLabel'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-80 gap-2">
		<MultiSelect
			items={engineers}
			bind:values
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			ariaLabel="Assign engineers"
			placeholder="Search engineers"
			{...args}
		/>
		<p class="text-xs text-muted-foreground">
			Selected: {values.length ? values.map((engineer) => engineer.name).join(', ') : 'none'}
		</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Loading" args={{ loading: true }} {template} />

{#snippet emptyTemplate(
	args: Omit<MultiSelectProps<Engineer>, 'items' | 'values' | 'getKey' | 'getLabel' | 'empty'>,
)}
	<div class="w-80">
		<MultiSelect
			{...args}
			items={[] as Engineer[]}
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			ariaLabel="Assign engineers"
			placeholder="Search engineers"
		>
			{#snippet empty()}
				No engineers match that search.
			{/snippet}
		</MultiSelect>
	</div>
{/snippet}

<Story name="Empty" template={emptyTemplate} />
