<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ApprovalActionContext } from '../approval-bar/index.js';
	import { Button } from '../button/index.js';
	import type { Props as ChatApprovalRequestProps } from './chat-approval-request.svelte';
	import ChatApprovalRequest from './chat-approval-request.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat Approval Request',
		component: ChatApprovalRequest,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			name: 'Jolt',
			initials: 'J',
			timestamp: new Date(Date.now() - 5 * 60 * 1000),
			effect: { label: 'External write', tone: 'warning' },
			title: 'Publish release notes',
			description: 'I need permission to send this draft to the public changelog.',
			onApprove: () => {},
			onReject: () => {},
		},
	});

	type TemplateArgs = ChatApprovalRequestProps;
</script>

{#snippet actions({ locked, describedBy }: ApprovalActionContext)}
	<Button
		variant="ghost"
		size="sm"
		disabled={locked}
		aria-describedby={describedBy}
		onclick={() => {}}
	>
		Edit draft
	</Button>
{/snippet}

{#snippet template(args: TemplateArgs)}
	<div class="w-[40rem] max-w-full">
		<ChatApprovalRequest {...args} {actions} />
	</div>
{/snippet}

<Story name="Pending" {template} />

<Story
	name="Locked"
	args={{
		locked: true,
		lockReason:
			'Automated runs cannot publish outside the workspace. Ask an operator to review this draft.',
	}}
	{template}
/>

<Story name="Approved" args={{ status: 'approved' }} {template} />

<Story name="Rejected" args={{ status: 'rejected' }} {template} />
