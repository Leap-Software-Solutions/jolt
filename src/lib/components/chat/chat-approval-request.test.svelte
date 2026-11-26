<script lang="ts">
	import type { ApprovalActionContext } from '../approval-bar/index.js';
	import { Button } from '../button/index.js';
	import type { Props } from './chat-approval-request.svelte';
	import ChatApprovalRequest from './chat-approval-request.svelte';

	let { onCustom = () => {}, ...props }: Props & { onCustom?: () => void } = $props();
</script>

<ChatApprovalRequest {...props}>
	{#snippet actions({ locked, describedBy }: ApprovalActionContext)}
		<Button
			variant="ghost"
			size="sm"
			disabled={locked}
			aria-describedby={describedBy}
			onclick={onCustom}
		>
			More actions
		</Button>
	{/snippet}
</ChatApprovalRequest>
