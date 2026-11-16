<script lang="ts" module>
	import type { AttachmentItem, AttachmentSize } from './types.js';

	export type Props = {
		attachment: AttachmentItem;
		size?: AttachmentSize;
		preview?: boolean;
		removable?: boolean;
		onPreview?: (attachment: AttachmentItem) => void;
		onRemove?: (attachment: AttachmentItem) => void;
		removeLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { FileCodeIcon, FileIcon, FileTextIcon, ImageIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { formatFileSize } from './format.js';
	import { getCodeLanguage, getTextFormat, getThumbnailSrc, isImageAttachment } from './preview.js';

	let {
		attachment,
		size = 'default',
		preview = true,
		removable = false,
		onPreview,
		onRemove,
		removeLabel = 'Remove attachment',
		class: className,
	}: Props = $props();

	const isSmall = $derived(size === 'sm');
	const imageSrc = $derived(
		preview && isImageAttachment(attachment) ? getThumbnailSrc(attachment) : undefined,
	);
	const hasPreviewAction = $derived(Boolean(preview && onPreview));
	function getFileTypeIcon() {
		if (getCodeLanguage(attachment)) return FileCodeIcon;
		if (getTextFormat(attachment)) return FileTextIcon;
		return FileIcon;
	}

	const FileTypeIcon = $derived(getFileTypeIcon());
	const sizeLabel = $derived(formatFileSize(attachment.size));
	const previewLabel = $derived(`Preview ${attachment.name}${sizeLabel ? ` ${sizeLabel}` : ''}`);
</script>

<div
	data-slot="attachment"
	data-attachment-id={attachment.id}
	class={cls(
		'flex max-w-full items-center gap-1 rounded-md border bg-background p-1',
		isSmall && 'max-w-64 rounded-lg',
		className,
	)}
>
	{#snippet content()}
		{#if imageSrc}
			<img
				data-slot="attachment-thumbnail"
				src={imageSrc}
				alt=""
				loading="lazy"
				class="size-8 shrink-0 rounded-md border object-cover"
			/>
		{:else if isImageAttachment(attachment)}
			<ImageIcon class="size-4 shrink-0 text-muted-foreground" />
		{:else}
			<FileTypeIcon class="size-4 shrink-0 text-muted-foreground" />
		{/if}
		<div class={cls('min-w-0 flex-1', isSmall ? 'grid' : 'flex items-center gap-2')}>
			<span class={cls('truncate', isSmall && 'font-medium')}>{attachment.name}</span>
			{#if sizeLabel}
				<span class="shrink-0 text-xs text-muted-foreground">
					{sizeLabel}
				</span>
			{/if}
		</div>
	{/snippet}

	{#if hasPreviewAction}
		<button
			type="button"
			data-slot="attachment-preview"
			aria-label={previewLabel}
			class={cls(
				'flex min-w-0 flex-1 items-center gap-2 rounded-md text-left transition-colors hover:bg-accent/50',
				'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
				isSmall ? 'py-0.5 pr-1 pl-1 text-xs' : 'px-1.5 py-1 text-sm',
			)}
			onclick={() => onPreview?.(attachment)}
		>
			{@render content()}
		</button>
	{:else}
		<div
			class={cls(
				'flex min-w-0 flex-1 items-center gap-2',
				isSmall ? 'py-0.5 pr-1 pl-1 text-xs' : 'px-1.5 py-1 text-sm',
			)}
		>
			{@render content()}
		</div>
	{/if}

	{#if removable}
		<Button
			variant="ghost"
			size="icon"
			class={cls('shrink-0', isSmall ? 'size-6' : 'size-7')}
			aria-label={`${removeLabel}: ${attachment.name}`}
			onclick={() => onRemove?.(attachment)}
		>
			<XIcon />
		</Button>
	{/if}
</div>
