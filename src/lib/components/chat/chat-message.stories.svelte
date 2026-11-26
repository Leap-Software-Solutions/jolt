<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import ChatMessage from './chat-message.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat Message',
		component: ChatMessage,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			role: 'assistant',
			name: 'Jolt',
		},
	});
</script>

<Story name="Assistant">
	Hello. I can help you inspect the repository and plan the next change.
</Story>

<Story
	name="User"
	args={{
		role: 'user',
		name: 'Ada',
		avatarSrc: 'https://i.pravatar.cc/100?img=12',
		initials: 'AL',
	}}
>
	Can you summarise the latest changes?
</Story>

<Story name="System" args={{ role: 'system' }}>Conversation started.</Story>

<Story name="With timestamp" args={{ timestamp: new Date(Date.now() - 3 * 60 * 1000) }}>
	The change is ready to review.
</Story>

<Story name="Streaming" args={{ status: 'streaming' }}>I am checking the component exports</Story>

<Story name="With actions" asChild>
	<div class="w-[30rem]">
		<ChatMessage role="assistant" name="Jolt">
			The change is ready to review.
			{#snippet actions()}
				<Button variant="ghost" size="sm">Copy</Button>
				<Button variant="ghost" size="sm">Regenerate</Button>
			{/snippet}
		</ChatMessage>
	</div>
</Story>
