<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FileIcon, XIcon } from '@lucide/svelte';
	import { Dialog as BitsDialog, Tabs as BitsTabs } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { CodeBlock } from '../code-block/index.js';
	import Markdown from '../markdown/markdown.svelte';
	import type { LightboxItem, Props } from './types.js';

	let {
		items,
		open = $bindable(false),
		index = $bindable(0),
		ariaLabel = 'Media preview',
		trigger,
		onOpenChange,
		onIndexChange,
		class: className,
	}: Props = $props();

	const current = $derived(items[index] ?? items[0]);
	const hasNavigation = $derived(items.length > 1);
	const isMarkdown = $derived(current?.kind === 'text' && current.format === 'markdown');
	// CodeBlock uses translucent muted surfaces by default; the overlay needs an opaque one.
	const codeBlockClass = 'min-h-full rounded-lg border-0 bg-muted [&>figcaption]:bg-muted';

	let textTab = $state('preview');

	$effect(() => {
		if (items.length === 0) {
			index = 0;
			return;
		}
		if (index < 0 || index >= items.length) index = 0;
	});

	$effect(() => {
		if (index >= 0) {
			textTab = 'preview';
		}
	});

	function setIndex(next: number): void {
		if (items.length === 0) return;
		const normalized = ((next % items.length) + items.length) % items.length;
		index = normalized;
		onIndexChange?.(normalized);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (!hasNavigation) return;
		const target = event.target as HTMLElement;
		if (target.closest('[role="tablist"]')) return;

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setIndex(index - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			setIndex(index + 1);
		}
	}

	function getItemLabel(item: LightboxItem): string {
		if (item.kind === 'image') return item.alt;
		if (item.kind === 'text' || item.kind === 'code') return item.title;
		return item.name;
	}
</script>

{#snippet codeSurface(content: string, language: string)}
	<div data-slot="lightbox-code" class="h-full overflow-auto rounded-lg">
		<CodeBlock code={content} {language} class={codeBlockClass} />
	</div>
{/snippet}

<BitsDialog.Root bind:open {onOpenChange}>
	{#if trigger}
		<BitsDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsDialog.Trigger>
	{/if}
	<BitsDialog.Portal>
		<BitsDialog.Overlay
			data-slot="lightbox-overlay"
			class="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsDialog.Content
			data-slot="lightbox"
			class={cls(
				'fixed inset-0 z-50 flex flex-col text-white outline-none',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
				className,
			)}
			onkeydown={handleKeydown}
		>
			<BitsDialog.Title class="sr-only">{ariaLabel}</BitsDialog.Title>

			<BitsTabs.Root bind:value={textTab} class="flex min-h-0 flex-1 flex-col">
				<div class="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
					<span class="col-start-1 text-xs text-white/70">
						{#if current}
							{index + 1} / {items.length}
						{/if}
					</span>

					{#if isMarkdown}
						<BitsTabs.List
							data-slot="lightbox-tabs"
							aria-label="Text preview mode"
							class="col-start-2 inline-flex h-8 items-center rounded-md bg-white/10 p-0.5 text-xs text-white/70"
						>
							<BitsTabs.Trigger
								value="preview"
								class="rounded px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden data-[state=active]:bg-white data-[state=active]:text-black"
							>
								Preview
							</BitsTabs.Trigger>
							<BitsTabs.Trigger
								value="code"
								class="rounded px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden data-[state=active]:bg-white data-[state=active]:text-black"
							>
								Code
							</BitsTabs.Trigger>
						</BitsTabs.List>
					{/if}

					<div class="col-start-3 flex items-center justify-end gap-1">
						{#if current?.kind !== 'file' && current?.downloadUrl}
							<Button
								href={current.downloadUrl}
								download
								variant="ghost"
								size="icon"
								class="size-8 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/50 focus-visible:ring-offset-0"
								aria-label={`Download ${getItemLabel(current)}`}
							>
								<DownloadIcon class="size-5" />
							</Button>
						{/if}
						<BitsDialog.Close
							type="button"
							aria-label="Close preview"
							class="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
						>
							<XIcon class="size-5" />
						</BitsDialog.Close>
					</div>
				</div>

				<div class="relative flex min-h-0 flex-1 items-center justify-center px-16 py-4">
					{#if current?.kind === 'image'}
						{@const image = current}
						<img
							data-slot="lightbox-image"
							src={image.src}
							alt={image.alt}
							class="max-h-full max-w-full object-contain"
						/>
					{:else if current?.kind === 'text'}
						{@const text = current}
						<div data-slot="lightbox-text" class="flex h-full w-full max-w-4xl flex-col gap-2">
							<h2
								data-slot="lightbox-text-title"
								title={text.title}
								class="shrink-0 truncate px-1 text-sm font-medium text-white/80"
							>
								{text.title}
							</h2>
							{#if text.format === 'markdown'}
								<BitsTabs.Content
									value="preview"
									class="min-h-0 flex-1 focus-visible:outline-hidden"
								>
									<div
										data-slot="lightbox-text-surface"
										class="h-full overflow-y-auto rounded-lg bg-background p-6 text-foreground shadow-xl"
									>
										<Markdown content={text.content} />
									</div>
								</BitsTabs.Content>
								<BitsTabs.Content value="code" class="min-h-0 flex-1 focus-visible:outline-hidden">
									{@render codeSurface(text.content, 'markdown')}
								</BitsTabs.Content>
							{:else}
								<div
									data-slot="lightbox-text-surface"
									class="min-h-0 flex-1 overflow-y-auto rounded-lg bg-background p-6 text-foreground shadow-xl"
								>
									<pre
										data-slot="lightbox-text-content"
										class="overflow-auto font-sans text-sm leading-relaxed break-words whitespace-pre-wrap">{text.content}</pre>
								</div>
							{/if}
						</div>
					{:else if current?.kind === 'code'}
						{@const code = current}
						<div data-slot="lightbox-code-item" class="flex h-full w-full max-w-4xl flex-col gap-2">
							<h2
								data-slot="lightbox-code-title"
								title={code.title}
								class="shrink-0 truncate px-1 text-sm font-medium text-white/80"
							>
								{code.title}
							</h2>
							{@render codeSurface(code.content, code.language)}
						</div>
					{:else if current?.kind === 'file'}
						{@const file = current}
						<div
							data-slot="lightbox-file"
							class="flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-lg bg-background p-6 text-center text-foreground shadow-xl"
						>
							<FileIcon class="size-10 text-muted-foreground" />
							<div class="grid min-w-0 gap-1">
								<p class="truncate text-sm font-medium">{file.name}</p>
								<p class="text-xs text-muted-foreground">This file can't be previewed.</p>
							</div>
							{#if file.downloadUrl}
								<Button
									href={file.downloadUrl}
									download
									variant="secondary"
									aria-label={`Download ${file.name}`}
								>
									<DownloadIcon />
									Download
								</Button>
							{/if}
						</div>
					{/if}
				</div>
			</BitsTabs.Root>

			{#if hasNavigation}
				<button
					type="button"
					aria-label="Previous item"
					class="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
					onclick={() => setIndex(index - 1)}
				>
					<ChevronLeftIcon class="size-6" />
				</button>
			{/if}

			{#if hasNavigation}
				<button
					type="button"
					aria-label="Next item"
					class="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
					onclick={() => setIndex(index + 1)}
				>
					<ChevronRightIcon class="size-6" />
				</button>
			{/if}

			{#if current?.kind === 'image' && current.caption}
				<p class="shrink-0 px-4 pb-4 text-center text-sm text-white/70">{current.caption}</p>
			{/if}
		</BitsDialog.Content>
	</BitsDialog.Portal>
</BitsDialog.Root>
