<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Component } from 'svelte';
	import Combobox from './combobox.svelte';
	import type { Props as ComboboxProps } from './types.js';
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

	const ComboboxEngineer = Combobox as unknown as Component<ComboboxProps<Engineer>>;

	const { Story } = defineMeta({
		title: 'Forms/Combobox',
		component: ComboboxEngineer,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	let value = $state<Engineer | undefined>(engineers[0]);

	let asyncItems = $state<Engineer[]>(engineers);
	let asyncValue = $state<Engineer | undefined>();
	let asyncLoading = $state(false);
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	function searchEngineers(query: string): void {
		asyncLoading = true;
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			const normalized = query.trim().toLowerCase();
			asyncItems = engineers.filter(
				(engineer) =>
					engineer.name.toLowerCase().includes(normalized) ||
					engineer.role.toLowerCase().includes(normalized),
			);
			asyncLoading = false;
		}, 300);
	}

	onDestroy(() => {
		if (searchTimer) clearTimeout(searchTimer);
	});

	type TemplateArgs = Omit<ComboboxProps<Engineer>, 'items' | 'value' | 'getKey' | 'getLabel'>;
	type EmptyArgs = Omit<
		ComboboxProps<Engineer>,
		'items' | 'value' | 'getKey' | 'getLabel' | 'empty'
	>;
	type CustomArgs = Omit<
		ComboboxProps<Engineer>,
		'items' | 'value' | 'getKey' | 'getLabel' | 'item'
	>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-72 gap-2">
		<Combobox
			items={engineers}
			bind:value
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			ariaLabel="Assign engineer"
			placeholder="Search engineers"
			{...args}
		/>
		<p class="text-xs text-muted-foreground">
			Selected: {value ? `${value.name} (${value.role})` : 'none'}
		</p>
	</div>
{/snippet}

{#snippet customTemplate(args: CustomArgs)}
	<div class="grid w-72 gap-2">
		<Combobox
			items={engineers}
			bind:value
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			ariaLabel="Assign engineer"
			placeholder="Search engineers"
			{...args}
		>
			{#snippet item(engineer)}
				<span class="flex items-center gap-2">
					<span
						class="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground"
					>
						{engineer.name.slice(0, 1)}
					</span>
					<span class="flex flex-col">
						<span>{engineer.name}</span>
						<span class="text-xs text-muted-foreground">{engineer.role}</span>
					</span>
				</span>
			{/snippet}
		</Combobox>
		<p class="text-xs text-muted-foreground">
			Selected: {value ? value.name : 'none'}
		</p>
	</div>
{/snippet}

{#snippet asyncTemplate()}
	<div class="grid w-72 gap-2">
		<Combobox
			items={asyncItems}
			bind:value={asyncValue}
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			onSearch={searchEngineers}
			loading={asyncLoading}
			ariaLabel="Assign engineer"
			placeholder="Search engineers"
		/>
		<p class="text-xs text-muted-foreground">
			Selected: {asyncValue ? asyncValue.name : 'none'}
		</p>
	</div>
{/snippet}

{#snippet emptyTemplate(args: EmptyArgs)}
	<div class="w-72">
		<Combobox
			{...args}
			items={[]}
			bind:value
			getKey={(engineer) => engineer.id}
			getLabel={(engineer) => engineer.name}
			ariaLabel="Assign engineer"
			placeholder="Search engineers"
		>
			{#snippet empty()}
				No engineers match that search.
			{/snippet}
		</Combobox>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With custom item" template={customTemplate} />

<Story name="Async search" template={asyncTemplate} />

<Story name="Loading" args={{ loading: true }} template={emptyTemplate} />

<Story name="Empty" template={emptyTemplate} />
