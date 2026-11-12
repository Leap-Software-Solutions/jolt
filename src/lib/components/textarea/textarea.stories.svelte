<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as TextareaProps } from './textarea.svelte';
	import Textarea from './textarea.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			placeholder: 'Tell us about the project…',
		},
	});

	type TemplateArgs = TextareaProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96">
		<Textarea {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With value" args={{ value: 'A short project brief.' }} {template} />

<Story name="Invalid" args={{ 'aria-invalid': true, value: 'Not a valid answer' }} {template} />

<Story name="Disabled" args={{ disabled: true, placeholder: 'Unavailable' }} {template} />

<Story
	name="Long content"
	args={{ rows: 6, value: 'Line one.\nLine two.\nLine three.\nLine four.' }}
	{template}
/>
