<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CodeBlock } from '../code-block/index.js';
	import ChatToolCall, { type Props as ChatToolCallProps } from './chat-tool-call.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat tool call',
		component: ChatToolCall,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			name: 'search_codebase',
			status: 'success',
			summary: 'Found 3 matching files',
		},
	});
</script>

{#snippet template(args: Omit<ChatToolCallProps, 'children'>)}
	<div class="w-[36rem] max-w-full">
		<ChatToolCall {...args}>
			<CodeBlock language="json" code={'{\n  "query": "import order",\n  "results": 3\n}'} />
		</ChatToolCall>
	</div>
{/snippet}

<Story name="Success" {template} />

<Story
	name="Running"
	args={{ status: 'running', summary: 'Searching the repository' }}
	{template}
/>

<Story name="Failed" args={{ status: 'error', summary: 'Search timed out' }} {template} />
