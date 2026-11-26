<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Avatar } from '../avatar/index.js';
	import { Badge } from '../badge/index.js';
	import FeedItem, { type Props as FeedItemProps } from './feed-item.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Feed Item',
		component: FeedItem,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'Deployment completed',
			meta: 'Production · 3 minutes ago',
			onActivate: () => {},
		},
	});
</script>

{#snippet avatarTemplate(args: FeedItemProps)}
	<div class="w-[28rem] rounded-lg border bg-card">
		<FeedItem {...args}>
			{#snippet leading()}
				<Avatar alt="Ada Lovelace" initials="AL" size="sm" />
			{/snippet}
			{#snippet trailing()}
				<Badge label="Ready" variant="secondary" />
			{/snippet}
		</FeedItem>
	</div>
{/snippet}

{#snippet actionTemplate(args: FeedItemProps)}
	<div class="w-[28rem] rounded-lg border bg-card">
		<FeedItem {...args}>
			{#snippet trailing()}
				<button class="rounded-md px-2 py-1 text-xs font-medium hover:bg-accent" type="button">
					Review
				</button>
			{/snippet}
		</FeedItem>
	</div>
{/snippet}

<Story name="Default" />

<Story name="Unread" args={{ unread: true }} />

<Story name="With leading and trailing" template={avatarTemplate} />

<Story name="Link" args={{ href: '/activity/42', onActivate: undefined }} />

<Story name="Trailing action" template={actionTemplate} />
