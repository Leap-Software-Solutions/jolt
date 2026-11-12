<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Separator from './separator.svelte';

	const { Story } = defineMeta({
		title: 'Layout/Separator',
		component: Separator,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Horizontal" asChild>
	<div class="w-64 text-sm">
		<p>Above the separator</p>
		<Separator class="my-4" />
		<p>Below the separator</p>
	</div>
</Story>

<Story name="Vertical" asChild>
	<div class="flex h-12 items-center gap-4 text-sm">
		<span>Left</span>
		<Separator orientation="vertical" />
		<span>Right</span>
	</div>
</Story>
