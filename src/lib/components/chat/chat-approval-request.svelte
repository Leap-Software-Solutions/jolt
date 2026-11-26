<script lang="ts" module>
	import type { ApprovalBarProps } from '../approval-bar/index.js';

	export type Props = Omit<ApprovalBarProps, 'class'> & {
		name?: string;
		avatarSrc?: string;
		initials?: string;
		timestamp?: string;
		ariaLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { ApprovalBar } from '../approval-bar/index.js';
	import ChatMessage from './chat-message.svelte';

	let {
		name,
		avatarSrc,
		initials,
		timestamp,
		ariaLabel,
		class: className,
		...approvalProps
	}: Props = $props();

	const messageLabel = $derived(ariaLabel ?? `${name ?? 'Assistant'} approval request`);
</script>

<div data-slot="chat-approval-request" class={className}>
	<ChatMessage
		role="assistant"
		{name}
		{avatarSrc}
		{initials}
		{timestamp}
		ariaLabel={messageLabel}
		bubbleClass="contents"
	>
		<ApprovalBar {...approvalProps} />
	</ChatMessage>
</div>
