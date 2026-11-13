<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import Spinner, { type Props as SpinnerProps, type SpinnerSize } from './spinner.svelte';

	const { Story } = defineMeta({
		title: 'Feedback/Spinner',
		component: Spinner,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});

	const sizes: SpinnerSize[] = ['sm', 'default', 'lg'];

	type TemplateArgs = Omit<SpinnerProps, 'size'>;
</script>

{#snippet template(args: TemplateArgs)}
	<Spinner {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="Sizes" asChild>
	<div class="flex items-end gap-6">
		{#each sizes as size (size)}
			<Spinner {size} />
		{/each}
	</div>
</Story>

<Story name="In a button" asChild>
	<Button disabled>
		<Spinner size="sm" />
		Saving
	</Button>
</Story>

<Story name="Custom label" args={{ label: 'Loading conversations' }} {template} />
