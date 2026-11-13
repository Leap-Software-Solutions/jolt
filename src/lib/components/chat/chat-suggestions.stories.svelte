<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatSuggestions from './chat-suggestions.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat suggestions',
		component: ChatSuggestions,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default" asChild>
	<div class="w-[34rem] max-w-full">
		<ChatSuggestions
			suggestions={[
				'Summarise the latest release',
				'Find unused component exports',
				'Explain the calendar range API',
			]}
		/>
	</div>
</Story>
