<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Label from './label.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Label',
		component: Label,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default">Email address</Story>
