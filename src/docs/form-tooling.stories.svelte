<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FormDemo from './fixtures/form-demo.svelte';

	const { Story } = defineMeta({
		title: 'Patterns/Form tooling',
		component: FormDemo,
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default" />
