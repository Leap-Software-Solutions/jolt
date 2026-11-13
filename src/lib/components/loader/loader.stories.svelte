<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Loader, { type Props as LoaderProps } from './loader.svelte';

	const { Story } = defineMeta({
		title: 'Feedback/Loader',
		component: Loader,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			label: 'Loading',
		},
	});
</script>

{#snippet template(args: LoaderProps)}
	<Loader {...args} />
{/snippet}

<Story name="Default" {template} />

<Story name="Small" args={{ size: 'sm' }} {template} />

<Story name="Large" args={{ size: 'lg' }} {template} />

<Story name="Decorative" args={{ decorative: true }} {template} />
