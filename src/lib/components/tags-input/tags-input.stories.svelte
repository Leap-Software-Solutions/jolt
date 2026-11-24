<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TagsInput from './tags-input.svelte';
	import type { Props as TagsInputProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/Tags Input',
		component: TagsInput,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let value = $state(['retro', 'action-item']);

	type TemplateArgs = Omit<TagsInputProps, 'value'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-96 gap-2">
		<TagsInput bind:value ariaLabel="Retro tags" {...args} />
		<p class="text-xs text-muted-foreground">
			{value.length ? value.join(', ') : 'No tags yet'}
		</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Invalid" args={{ invalid: true }} {template} />

<Story name="Max tags" args={{ maxTags: 3 }} {template} />
