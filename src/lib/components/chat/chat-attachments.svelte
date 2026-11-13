<script lang="ts" module>
	import type { ChatAttachment } from './types.js';

	export type Props = {
		attachments: ChatAttachment[];
		removable?: boolean;
		onRemove?: (attachment: ChatAttachment) => void;
		removeLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { FileIcon, FileTextIcon, ImageIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		attachments,
		removable = false,
		onRemove,
		removeLabel = 'Remove attachment',
		class: className,
	}: Props = $props();

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
				<Icon class="size-4 shrink-0 text-muted-foreground" />
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
