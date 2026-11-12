<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Pagination, { type Props as PaginationProps } from './pagination.svelte';

	const { Story } = defineMeta({
		title: 'Navigation/Pagination',
		component: Pagination,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			count: 100,
			perPage: 10,
		},
	});

	type TemplateArgs = Omit<PaginationProps, 'page'>;
</script>

<script lang="ts">
	let page = $state(1);
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid justify-items-center gap-2">
		<Pagination {...args} bind:page />
		<p class="text-xs text-muted-foreground">Page {page}</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Few pages" args={{ count: 35, perPage: 10 }} {template} />

<Story name="Many pages" args={{ count: 1000, perPage: 25, siblingCount: 2 }} {template} />
