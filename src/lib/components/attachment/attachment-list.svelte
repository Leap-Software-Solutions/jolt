<script lang="ts" module>
	import type { AttachmentItem, AttachmentSize } from './types.js';

	export type Props = {
		attachments: AttachmentItem[];
		preview?: boolean;
		removable?: boolean;
		onRemove?: (attachment: AttachmentItem) => void;
		removeLabel?: string;
		size?: AttachmentSize;
		ariaLabel?: string;
		previewLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Lightbox } from '../lightbox/index.js';
	import Attachment from './attachment.svelte';
	import { toLightboxItem } from './preview.js';

	let {
		attachments,
		preview = true,
		removable = false,
		onRemove,
		removeLabel = 'Remove attachment',
		size = 'default',
		ariaLabel,
		previewLabel = 'Attachment preview',
		class: className,
	}: Props = $props();

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const lightboxItems = $derived(preview ? attachments.map(toLightboxItem) : []);

	$effect(() => {
		if (lightboxOpen && lightboxItems.length === 0) lightboxOpen = false;
	});

	function openPreview(attachment: AttachmentItem): void {
		const index = attachments.findIndex((candidate) => candidate.id === attachment.id);
		if (index < 0) return;
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<ul
	data-slot="attachment-list"
	aria-label={ariaLabel}
	class={cls('flex flex-wrap gap-2', className)}
>
	{#each attachments as attachment (attachment.id)}
		<li class="max-w-full">
			<Attachment
				{attachment}
				{size}
				{preview}
				{removable}
				{onRemove}
				{removeLabel}
				onPreview={preview ? openPreview : undefined}
			/>
		</li>
	{/each}
</ul>

<Lightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	items={lightboxItems}
	ariaLabel={previewLabel}
/>
