<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CodeBlock } from '../code-block/index.js';
	import ChatToolCall, { type Props as ChatToolCallProps } from './chat-tool-call.svelte';

	const allowOptions: ChatToolCallProps['allowOptions'] = [
		{ label: 'Allow for this session', onSelect: () => {} },
	];

	const approvalMenu: ChatToolCallProps['approvalMenu'] = [
		{ label: 'View arguments', onSelect: () => {} },
		{ type: 'separator' },
		{ label: 'Block this tool', variant: 'destructive', onSelect: () => {} },
	];

	const { Story } = defineMeta({
		title: 'Chat/Chat Tool Call',
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

<Story
	name="Awaiting approval"
	args={{
		name: 'delete_file',
		status: 'awaiting-approval',
		summary: 'Delete src/legacy.ts',
		approvalDescription: 'The assistant wants to delete a file. This cannot be undone.',
		onApprove: () => {},
		onDeny: () => {},
		allowOptions,
		approvalMenu,
	}}
	{template}
/>

<Story name="Denied" args={{ status: 'denied', summary: 'Permission denied' }} {template} />
