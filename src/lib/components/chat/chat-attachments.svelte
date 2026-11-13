<script lang="ts" module>
	import type { ChatAttachment } from './types.js';

	export type Props = {
		attachments: ChatAttachment[];
		removable?: boolean;
		onRemove?: (attachment: ChatAttachment) => void;
		removeLabel?: string;
		preview?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { AttachmentList } from '../attachment/index.js';

	let {
		attachments,
		removable = false,
		onRemove,
		removeLabel = 'Remove attachment',
		preview = true,
		class: className,
	}: Props = $props();
</script>

<section data-slot="chat-attachments" aria-label="Attachments" class={className}>
	{#if attachments.length === 0}
		<span class="text-xs text-muted-foreground">No attachments</span>
	{:else}
		<AttachmentList
			{attachments}
			{preview}
			{removable}
			{onRemove}
			{removeLabel}
			size="sm"
			previewLabel="Attachment preview"
		/>
	{/if}
</section>
