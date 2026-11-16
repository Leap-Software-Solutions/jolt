<script lang="ts" module>
	export type Props = {
		files?: File[];
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		disabled?: boolean;
		label?: string;
		description?: string;
		onFilesChange?: (files: File[]) => void;
		preview?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { CloudUploadIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { AttachmentList } from '../attachment/index.js';
	import { hasTextPreview } from '../attachment/preview.js';
	import type { AttachmentItem } from '../attachment/types.js';

	let {
		files = $bindable<File[]>([]),
		accept,
		multiple = false,
		maxSize,
		disabled,
		label = 'Upload files',
		description = 'Drag and drop files here, or click to browse.',
		onFilesChange,
		preview = true,
		class: className,
	}: Props = $props();

	let input = $state<HTMLInputElement | null>(null);
	let isDragging = $state(false);
	let sizeError = $state('');
	let previewAttachments = $state<AttachmentItem[]>([]);

	function getFileId(file: File, index: number): string {
		return `${index}-${file.name}-${file.lastModified}-${file.size}`;
	}

	$effect(() => {
		if (!preview) {
			previewAttachments = files.map((file, index) => ({
				id: getFileId(file, index),
				name: file.name,
				size: file.size,
				type: file.type,
			}));
			return;
		}

		let cancelled = false;
		const urls = files.map((file) => URL.createObjectURL(file));
		const attachments = files.map((file, index) => ({
			id: getFileId(file, index),
			name: file.name,
			size: file.size,
			type: file.type,
			href: urls[index],
			previewSrc: urls[index],
			thumbnailSrc: urls[index],
		}));

		previewAttachments = attachments;

		const textFiles = files
			.map((file, index) => ({ attachment: attachments[index], file, index }))
			.filter(({ attachment }) => hasTextPreview(attachment));

		if (textFiles.length > 0) {
			void Promise.all(
				textFiles.map(async ({ file, index }) => {
					try {
						return { index, content: await file.text() };
					} catch {
						return { index, content: undefined };
					}
				}),
			).then((contents) => {
				if (cancelled) return;

				const next = [...previewAttachments];
				for (const entry of contents) {
					if (entry.content === undefined) continue;
					next[entry.index] = { ...next[entry.index], content: entry.content };
				}
				previewAttachments = next;
			});
		}

		return () => {
			cancelled = true;
			for (const url of urls) URL.revokeObjectURL(url);
		};
	});

	function updateFiles(next: File[]): void {
		files = next;
		onFilesChange?.(next);
	}

	function addFiles(incoming: FileList | File[]): void {
		const candidates = Array.from(incoming);
		const accepted = maxSize ? candidates.filter((file) => file.size <= maxSize) : candidates;
		const rejected = candidates.length - accepted.length;

		sizeError = rejected > 0 ? `${rejected} file(s) exceed the size limit.` : '';
		if (accepted.length === 0) return;

		const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
		updateFiles(next);
	}

	function handleInput(event: Event): void {
		const target = event.currentTarget as HTMLInputElement;
		if (target.files) addFiles(target.files);
		target.value = '';
	}

	function handleDrop(event: DragEvent): void {
		event.preventDefault();
		isDragging = false;
		if (!disabled && event.dataTransfer?.files) addFiles(event.dataTransfer.files);
	}

	function removeAttachment(attachment: AttachmentItem): void {
		const index = previewAttachments.findIndex((candidate) => candidate.id === attachment.id);
		if (index < 0) return;
		updateFiles(files.filter((_, fileIndex) => fileIndex !== index));
	}

	function openPicker(): void {
		if (!disabled) input?.click();
	}
</script>

<div data-slot="file-upload" class={cls('grid gap-2', className)}>
	<div
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-disabled={disabled}
		data-slot="file-upload-dropzone"
		class={cls(
			'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors',
			'border-input bg-background hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			isDragging && 'border-brand bg-brand-subtle/40',
			disabled && 'pointer-events-none opacity-50',
		)}
		onclick={openPicker}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openPicker();
			}
		}}
		ondragover={(event) => {
			event.preventDefault();
			if (!disabled) isDragging = true;
		}}
		ondragleave={() => (isDragging = false)}
		ondrop={handleDrop}
	>
		<CloudUploadIcon class="size-6 text-muted-foreground" />
		<div class="grid gap-1">
			<span class="text-sm font-medium">{label}</span>
			<span class="text-xs text-muted-foreground">{description}</span>
		</div>
	</div>

	<input
		bind:this={input}
		type="file"
		aria-label={label}
		{accept}
		{multiple}
		{disabled}
		class="sr-only"
		onchange={handleInput}
	/>

	{#if files.length > 0}
		<AttachmentList
			attachments={previewAttachments}
			{preview}
			removable
			onRemove={removeAttachment}
			removeLabel="Remove file"
			size="default"
			ariaLabel="Selected files"
			previewLabel="File preview"
			class="grid gap-1.5"
		/>
	{/if}

	{#if sizeError}
		<p class="text-xs text-destructive" role="alert">{sizeError}</p>
	{/if}
</div>
