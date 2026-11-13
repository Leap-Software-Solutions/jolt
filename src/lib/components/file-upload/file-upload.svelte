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
	import { CloudUploadIcon, FileIcon, XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Lightbox, type LightboxImage } from '../lightbox/index.js';

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
	const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let objectUrls = $state<string[]>([]);

	function isImageFile(file: File): boolean {
		return file.type.startsWith('image/') || imageExtension.test(file.name);
	}

	$effect(() => {
		if (!preview) {
			objectUrls = [];
			return;
		}

		const urls = files.map((file) => {
			if (!isImageFile(file)) return '';
			return URL.createObjectURL(file);
		});

		objectUrls = urls;

		return () => {
			for (const url of urls) {
				if (url) URL.revokeObjectURL(url);
			}
		};
	});

	const previewImages = $derived.by(() => {
		const images: LightboxImage[] = [];
		if (!preview) return images;

		files.forEach((file, index) => {
			const src = objectUrls[index];
			if (!src) return;
			images.push({ kind: 'image', src, alt: file.name, caption: file.name });
		});

		return images;
	});

	$effect(() => {
		if (lightboxOpen && lightboxIndex >= previewImages.length) lightboxOpen = false;
	});

	function openPreview(fileIndex: number): void {
		const src = objectUrls[fileIndex];
		const index = previewImages.findIndex((image) => image.src === src);
		if (index < 0) return;
		lightboxIndex = index;
		lightboxOpen = true;
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

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

	function removeFile(index: number): void {
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
		<ul class="grid gap-1.5" aria-label="Selected files">
			{#each files as file, index (file.name + index)}
				<li
					data-slot="file-upload-item"
					class="flex items-center gap-2 rounded-md border bg-background px-2.5 py-2 text-sm"
				>
					{#if preview && objectUrls[index]}
						<button
							type="button"
							data-slot="file-upload-preview"
							aria-label={`Preview ${file.name}`}
							class="size-8 shrink-0 overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
							onclick={() => openPreview(index)}
						>
							<img src={objectUrls[index]} alt="" loading="lazy" class="size-full object-cover" />
						</button>
					{:else}
						<FileIcon class="size-4 shrink-0 text-muted-foreground" />
					{/if}
					<span class="min-w-0 flex-1 truncate">{file.name}</span>
					<span class="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
					<Button
						variant="ghost"
						size="icon"
						class="size-7 shrink-0"
						aria-label={`Remove ${file.name}`}
						onclick={() => removeFile(index)}
					>
						<XIcon />
					</Button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if sizeError}
		<p class="text-xs text-destructive" role="alert">{sizeError}</p>
	{/if}
</div>

<Lightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	items={previewImages}
	ariaLabel="File preview"
/>
