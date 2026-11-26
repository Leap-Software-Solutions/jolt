<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CommentThread from './comment-thread.svelte';
	import type { CommentThreadComment, Props as CommentThreadProps } from './types.js';

	const comments: CommentThreadComment[] = [
		{
			id: 'c1',
			author: { name: 'Ada Lovelace', initials: 'AL' },
			body: 'Could we keep the **existing import order**? It keeps the review diff smaller.',
			timestamp: new Date(Date.now() - 12 * 60 * 1000),
		},
		{
			id: 'c2',
			author: { name: 'Grace Hopper', initials: 'GH' },
			body: 'Agreed. I will update the fixture and re-run the review surface checks.',
			timestamp: new Date(Date.now() - 4 * 60 * 1000),
		},
	];

	const { Story } = defineMeta({
		title: 'Patterns/Comment Thread',
		component: CommentThread,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			comments,
			onQuote: () => {},
			onSubmit: () => {},
		},
	});

	type TemplateArgs = Omit<CommentThreadProps, 'draft'>;
</script>

<script lang="ts">
	let draft = $state('');
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-[40rem] max-w-full">
		<CommentThread {...args} bind:draft />
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Resolved" args={{ resolved: true }} {template} />

<Story name="Highlighted" args={{ highlightedCommentId: 'c2' }} {template} />
