<script lang="ts">
	import { Button } from '../button/index.js';
	import ApprovalBar from './approval-bar.svelte';
	import type { ApprovalActionContext, Props } from './types.js';

	let { onCustom = () => {}, ...props }: Props & { onCustom?: () => void } = $props();
</script>

<ApprovalBar {...props}>
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
</ApprovalBar>
