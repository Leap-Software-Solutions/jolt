<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as InlineEditProps } from './inline-edit.svelte';
	import InlineEdit from './inline-edit.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Inline Edit',
		component: InlineEdit,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			placeholder: 'Add a card',
			ariaLabel: 'Card text',
			onValueChange: () => {},
		},
	});
</script>

<script lang="ts">
	import { Button } from '../button/index.js';

	let value = $state('Move the release checklist into the retro');
	let emptyValue = $state('');
	let multilineValue = $state(
		'First line of the card\nSecond line with enough detail to wrap when the editor is narrow.',
	);
	let externalValue = $state('Edit this card from the button');
	let editing = $state(false);
	let lastCommitted = $state('');

	type TemplateArgs = Omit<InlineEditProps, 'value' | 'editing' | 'onValueChange'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96 space-y-3">
		<InlineEdit
			bind:value
			bind:editing
			{...args}
			onValueChange={(next) => (lastCommitted = next)}
		/>
		<p class="text-xs text-muted-foreground">Value: {value || '(empty)'}</p>
		<p class="text-xs text-muted-foreground">Last commit: {lastCommitted || '(none)'}</p>
	</div>
{/snippet}

{#snippet multilineTemplate(args: TemplateArgs)}
	<div class="w-96 space-y-3">
		<InlineEdit
			bind:value={multilineValue}
			{...args}
			onValueChange={(next) => (lastCommitted = next)}
		/>
		<p class="text-xs text-muted-foreground">Value: {multilineValue || '(empty)'}</p>
		<p class="text-xs text-muted-foreground">Last commit: {lastCommitted || '(none)'}</p>
	</div>
{/snippet}

{#snippet emptyTemplate(args: TemplateArgs)}
	<div class="w-96 space-y-3">
		<InlineEdit
			bind:value={emptyValue}
			{...args}
			onValueChange={(next) => (lastCommitted = next)}
		/>
		<p class="text-xs text-muted-foreground">Value: {emptyValue || '(empty)'}</p>
	</div>
{/snippet}

{#snippet externalTemplate(args: TemplateArgs)}
	<div class="w-96 space-y-3">
		<div class="flex items-center justify-between gap-3">
			<p class="text-xs text-muted-foreground">Editing: {editing ? 'yes' : 'no'}</p>
			<Button variant="outline" size="sm" onclick={() => (editing = true)}>Edit card</Button>
		</div>
		<InlineEdit
			bind:value={externalValue}
			bind:editing
			{...args}
			onValueChange={(next) => (lastCommitted = next)}
		/>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Multiline" args={{ multiline: true }} template={multilineTemplate} />

<Story name="Empty" template={emptyTemplate} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="External trigger" template={externalTemplate} />
