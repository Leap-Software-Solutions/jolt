<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import ApprovalBar from './approval-bar.svelte';
	import type { ApprovalActionContext, Props as ApprovalBarProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Patterns/Approval Bar',
		component: ApprovalBar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			effect: { label: 'External write', tone: 'warning' },
			title: 'Publish release notes',
			description: 'This sends the draft to the public changelog.',
			onApprove: () => {},
			onReject: () => {},
		},
	});

	type TemplateArgs = ApprovalBarProps;
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
		<ApprovalBar {...args} {actions} />
	</div>
{/snippet}

<Story name="Default" {template} />

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

<Story name="Without effect" args={{ effect: undefined }} {template} />
