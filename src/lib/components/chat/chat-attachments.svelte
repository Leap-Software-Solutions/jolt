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
	import { FileIcon, FileTextIcon, ImageIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { ImageLightbox, type LightboxImage } from '../image-lightbox/index.js';

	let {
		attachments,
		removable = false,
		onRemove,
		removeLabel = 'Remove attachment',
		preview = true,
		class: className,
	}: Props = $props();

	const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	function isImageAttachment(attachment: ChatAttachment): boolean {
		return Boolean(attachment.type?.startsWith('image/') || imageExtension.test(attachment.name));
	}

	function getPreviewSrc(attachment: ChatAttachment): string | undefined {
		return attachment.previewSrc ?? attachment.href ?? attachment.thumbnailSrc;
	}

	function getThumbnailSrc(attachment: ChatAttachment): string | undefined {
		return attachment.thumbnailSrc ?? attachment.previewSrc ?? attachment.href;
	}

	const previewImages = $derived.by(() => {
		const images: LightboxImage[] = [];
		if (!preview) return images;

		for (const attachment of attachments) {
			if (!isImageAttachment(attachment)) continue;
			const src = getPreviewSrc(attachment);
			if (!src) continue;
			images.push({ src, alt: attachment.alt ?? attachment.name, caption: attachment.name });
		}

		return images;
	});

	function openPreview(attachment: ChatAttachment): void {
		const src = getPreviewSrc(attachment);
		const index = previewImages.findIndex((image) => image.src === src);
		if (index < 0) return;
		lightboxIndex = index;
		lightboxOpen = true;
	}

	function formatSize(bytes: number | undefined): string {
		if (!bytes) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function iconFor(type: string | undefined) {
		if (type?.startsWith('image/')) return ImageIcon;
		if (type?.startsWith('text/')) return FileTextIcon;
		return FileIcon;
	}
</script>

<section
	aria-label="Attachments"
	data-slot="chat-attachments"
	class={cls('flex flex-wrap gap-2', className)}
>
	{#if attachments.length === 0}
		<span class="text-xs text-muted-foreground">No attachments</span>
	{:else}
		{#each attachments as attachment (attachment.id)}
			{@const Icon = iconFor(attachment.type)}
			<div
				data-slot="chat-attachment"
				class={cls(
					'flex max-w-64 items-center gap-2 rounded-lg border bg-background py-1.5 pl-2 text-xs',
					removable ? 'pr-1.5' : 'pr-2.5',
				)}
			>
				{#if preview && isImageAttachment(attachment) && getThumbnailSrc(attachment)}
					<button
						type="button"
						data-slot="chat-attachment-preview"
						aria-label={`Preview ${attachment.name}`}
						class="size-8 shrink-0 overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
						onclick={() => openPreview(attachment)}
					>
						<img
							src={getThumbnailSrc(attachment)}
							alt=""
							loading="lazy"
							class="size-full object-cover"
						/>
					</button>
				{:else}
					<Icon class="size-4 shrink-0 text-muted-foreground" />
				{/if}
				<div class="min-w-0">
					{#if attachment.href}
						<a
							href={attachment.href}
							class="block truncate font-medium hover:underline"
							target="_blank"
							rel="noreferrer"
						>
							{attachment.name}
						</a>
					{:else}
						<span class="block truncate font-medium">{attachment.name}</span>
					{/if}
					{#if attachment.size}
						<span class="text-muted-foreground">{formatSize(attachment.size)}</span>
					{/if}
				</div>
				{#if removable}
					<Button
						variant="ghost"
						size="icon"
						class="size-6 shrink-0"
						aria-label={`${removeLabel}: ${attachment.name}`}
						onclick={() => onRemove?.(attachment)}
					>
						<XIcon />
					</Button>
				{/if}
			</div>
		{/each}
	{/if}
</section>

<ImageLightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	images={previewImages}
	ariaLabel="Attachment preview"
/>
