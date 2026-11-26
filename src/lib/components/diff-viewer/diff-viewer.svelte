<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { DiffViewMode } from './types.js';

	export type Props = {
		patch: string;
		view?: DiffViewMode;
		showWhitespace?: boolean;
		language?: string;
		empty?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { ChevronRightIcon } from '@lucide/svelte';
	import { highlightCode } from '../../utils/highlight.js';
	import { cls } from '../../utils/index.js';
	import { getLanguageFromName } from '../../utils/language.js';
	import { Badge, type BadgeVariant } from '../badge/index.js';
	import { parsePatch } from './parse-patch.js';
	import type { DiffFile, DiffHunk, DiffLine } from './types.js';

	type SplitRow = {
		left?: DiffLine;
		right?: DiffLine;
	};

	let {
		patch,
		view = 'unified',
		showWhitespace = false,
		language,
		empty,
		class: className,
	}: Props = $props();

	const files = $derived(parsePatch(patch));

	function getStatusLabel(file: DiffFile): string {
		if (file.status === 'mode-changed') return 'mode changed';
		return file.status;
	}

	function getStatusVariant(file: DiffFile): BadgeVariant {
		if (file.status === 'added') return 'success';
		if (file.status === 'deleted') return 'danger';
		if (file.status === 'renamed' || file.status === 'copied') return 'info';
		if (file.status === 'mode-changed') return 'warning';
		return 'secondary';
	}

	function getFileLabel(file: DiffFile): string {
		if (file.status === 'added') return file.newPath ?? '';
		if (file.status === 'deleted') return file.oldPath ?? '';
		if (file.oldPath && file.newPath && file.oldPath !== file.newPath) {
			return `${file.oldPath} → ${file.newPath}`;
		}
		return file.oldPath ?? file.newPath ?? '';
	}

	function getFileKey(file: DiffFile, index: number): string {
		return `${file.oldPath ?? ''}:${file.newPath ?? ''}:${index}`;
	}

	function getLineMarker(line: DiffLine): string {
		if (line.kind === 'add') return '+';
		if (line.kind === 'delete') return '-';
		return ' ';
	}

	function getLineClass(line: DiffLine, side?: 'old' | 'new'): string {
		if (line.kind === 'add' && side !== 'old') return 'bg-success/10';
		if (line.kind === 'delete' && side !== 'new') return 'bg-destructive/10';
		return '';
	}

	function getFileLanguage(file: DiffFile): string | null {
		return language ?? getLanguageFromName(file.newPath ?? file.oldPath ?? '');
	}

	function addWhitespaceMarkers(html: string): string {
		return html
			.split(/(<[^>]+>)/g)
			.map((part) => {
				if (part.startsWith('<')) return part;
				return part
					.replaceAll(' ', '<span class="text-muted-foreground">·</span>')
					.replaceAll('\t', '<span class="text-muted-foreground">→</span>');
			})
			.join('');
	}

	function getLineHtml(line: DiffLine, fileLanguage: string | null): string {
		const highlighted = highlightCode(line.content, fileLanguage ?? undefined);
		return showWhitespace ? addWhitespaceMarkers(highlighted) : highlighted;
	}

	function getSplitRows(hunk: DiffHunk): SplitRow[] {
		const rows: SplitRow[] = [];
		let index = 0;

		while (index < hunk.lines.length) {
			const line = hunk.lines[index]!;
			if (line.kind === 'context') {
				rows.push({ left: line, right: line });
				index += 1;
				continue;
			}

			const deletes: DiffLine[] = [];
			const adds: DiffLine[] = [];

			while (index < hunk.lines.length && hunk.lines[index]?.kind === 'delete') {
				deletes.push(hunk.lines[index]!);
				index += 1;
			}

			while (index < hunk.lines.length && hunk.lines[index]?.kind === 'add') {
				adds.push(hunk.lines[index]!);
				index += 1;
			}

			const count = Math.max(deletes.length, adds.length);
			for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
				rows.push({ left: deletes[rowIndex], right: adds[rowIndex] });
			}
		}

		return rows;
	}

	function getFileNotice(file: DiffFile): string {
		if (file.status === 'mode-changed') {
			return `File mode changed from ${file.oldMode ?? 'unknown'} to ${file.newMode ?? 'unknown'}.`;
		}
		if (file.status === 'renamed') return 'File renamed without content changes.';
		if (file.status === 'copied') return 'File copied without content changes.';
		return 'No content changes.';
	}
</script>

{#snippet splitCell(line: DiffLine | undefined, side: 'old' | 'new', fileLanguage: string | null)}
	<div
		data-slot="diff-split-cell"
		data-kind={line?.kind ?? 'empty'}
		class={cls(
			'grid min-h-5 grid-cols-[3rem_1.5rem_minmax(0,1fr)] font-mono text-xs leading-5',
			line ? getLineClass(line, side) : 'bg-muted/20',
			side === 'old' && 'border-r',
		)}
	>
		<span class="px-1.5 text-right text-muted-foreground/70 tabular-nums select-none">
			{side === 'old' ? (line?.oldLine ?? '') : (line?.newLine ?? '')}
		</span>
		<span
			aria-hidden="true"
			class={cls(
				'select-none',
				line?.kind === 'add'
					? 'text-success'
					: line?.kind === 'delete'
						? 'text-destructive'
						: 'text-muted-foreground',
			)}
		>
			{line ? getLineMarker(line) : ''}
		</span>
		<!-- eslint-disable svelte/no-at-html-tags -- highlight.js escapes code before rendering -->
		<span class={cls('min-w-0 pr-3 whitespace-pre', !line && 'select-none')}
			>{#if line}{@html getLineHtml(line, fileLanguage)}{/if}</span
		>
		<!-- eslint-enable svelte/no-at-html-tags -->
	</div>
{/snippet}

{#snippet unifiedLines(hunk: DiffHunk, fileLanguage: string | null)}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
		tabindex="0"
		role="region"
		aria-label={hunk.header}
	>
		{#each hunk.lines as line, index (index)}
			<div
				data-slot="diff-line"
				data-kind={line.kind}
				class={cls(
					'grid min-h-5 grid-cols-[3rem_3rem_1.5rem_minmax(0,1fr)] font-mono text-xs leading-5',
					getLineClass(line),
				)}
			>
				<span class="px-1.5 text-right text-muted-foreground/70 tabular-nums select-none">
					{line.oldLine ?? ''}
				</span>
				<span class="px-1.5 text-right text-muted-foreground/70 tabular-nums select-none">
					{line.newLine ?? ''}
				</span>
				<span
					aria-hidden="true"
					class={cls(
						'select-none',
						line.kind === 'add'
							? 'text-success'
							: line.kind === 'delete'
								? 'text-destructive'
								: 'text-muted-foreground',
					)}
				>
					{getLineMarker(line)}
				</span>
				<!-- eslint-disable svelte/no-at-html-tags -- highlight.js escapes code before rendering -->
				<span class="min-w-0 pr-3 whitespace-pre">{@html getLineHtml(line, fileLanguage)}</span>
				<!-- eslint-enable svelte/no-at-html-tags -->
			</div>
		{/each}
	</div>
{/snippet}

<div data-slot="diff-viewer" class={cls('flex flex-col gap-3 text-sm', className)}>
	{#if files.length === 0}
		<div
			class="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground"
		>
			{#if empty}
				{@render empty()}
			{:else}
				No changes.
			{/if}
		</div>
	{:else}
		{#each files as file, fileIndex (getFileKey(file, fileIndex))}
			<details
				open
				data-slot="diff-file"
				data-status={file.status}
				data-binary={file.binary || undefined}
				class="group overflow-hidden rounded-lg border bg-card"
			>
				<summary
					class="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1.5 border-border/60 bg-muted/30 px-3 py-2 text-sm group-open:border-b [&::-webkit-details-marker]:hidden"
				>
					<ChevronRightIcon
						aria-hidden="true"
						class="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
					/>
					<span class="min-w-0 truncate font-mono text-xs font-medium">{getFileLabel(file)}</span>
					<Badge label={getStatusLabel(file)} variant={getStatusVariant(file)} />
					{#if file.binary}
						<Badge label="binary" variant="neutral" />
					{/if}
					<span class="ml-auto flex shrink-0 items-center gap-2 text-xs tabular-nums">
						<span class="sr-only">{file.additions} additions, {file.deletions} deletions</span>
						<span aria-hidden="true" class="text-success">+{file.additions}</span>
						<span aria-hidden="true" class="text-destructive">-{file.deletions}</span>
					</span>
				</summary>

				<div data-slot="diff-file-body">
					{#if file.binary}
						<p class="px-3 py-4 text-sm text-muted-foreground">Binary file.</p>
					{:else if file.hunks.length === 0}
						<p class="px-3 py-4 text-sm text-muted-foreground">{getFileNotice(file)}</p>
					{:else}
						{#each file.hunks as hunk, hunkIndex (hunkIndex)}
							<details open data-slot="diff-hunk" class="group/hunk border-b last:border-b-0">
								<summary
									class="flex cursor-pointer list-none items-center gap-2 border-border/60 bg-muted/20 px-3 py-1 font-mono text-xs text-muted-foreground group-open/hunk:border-b [&::-webkit-details-marker]:hidden"
								>
									<ChevronRightIcon
										aria-hidden="true"
										class="size-3.5 shrink-0 transition-transform group-open/hunk:rotate-90"
									/>
									<span>{hunk.header}</span>
								</summary>
								{#if view === 'split'}
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<div
										class="overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
										tabindex="0"
										role="region"
										aria-label={hunk.header}
									>
										{#each getSplitRows(hunk) as row, rowIndex (rowIndex)}
											<div class="grid grid-cols-2">
												{@render splitCell(row.left, 'old', getFileLanguage(file))}
												{@render splitCell(row.right, 'new', getFileLanguage(file))}
											</div>
										{/each}
									</div>
								{:else}
									{@render unifiedLines(hunk, getFileLanguage(file))}
								{/if}
							</details>
						{/each}
					{/if}
				</div>
			</details>
		{/each}
	{/if}
</div>
