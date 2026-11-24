<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatActions from './chat-actions.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat Actions',
		component: ChatActions,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			content: 'The response can be copied or regenerated.',
			onRegenerate: () => {},
			onFeedback: () => {},
		},
	});
</script>

<Story name="Default" />

<Story name="Selected feedback" args={{ feedback: 'up' }} />
