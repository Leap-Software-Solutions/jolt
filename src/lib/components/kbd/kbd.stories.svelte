<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Kbd from './kbd.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Kbd',
		component: Kbd,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default">K</Story>

<Story name="Shortcut" asChild>
	<div class="flex items-center gap-1">
		<Kbd>⌘</Kbd>
		<Kbd>K</Kbd>
	</div>
</Story>

<Story name="Small" asChild>
	<div class="flex items-center gap-1">
		<Kbd size="sm">Ctrl</Kbd>
		<Kbd size="sm">Enter</Kbd>
	</div>
</Story>
