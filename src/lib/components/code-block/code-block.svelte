<script lang="ts" module>
	export type Props = {
		code: string;
		language?: string;
		label?: string;
		copyable?: boolean;
		copyLabel?: string;
		copiedLabel?: string;
		showLineNumbers?: boolean;
		highlightLines?: number[];
		wrap?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { highlightCode } from '../../utils/highlight.js';
	import { cls } from '../../utils/index.js';
	import { CopyButton } from '../copy-button/index.js';
	import { splitHighlightedLines } from './split-highlighted-lines.js';

	let {
		code,
		language = 'text',
		label,
		copyable = true,
		copyLabel = 'Copy code',
		copiedLabel = 'Copied',
		showLineNumbers = false,
		highlightLines = [],
		wrap = false,
		class: className,
	}: Props = $props();

	const highlighted = $derived(highlightCode(code, language));
	const lines = $derived(splitHighlightedLines(highlighted));
	const highlightedLineSet = $derived(new Set(highlightLines));
	const splitLines = $derived(showLineNumbers || highlightLines.length > 0);
	const languageLabel = $derived(label ?? language);
</script>

<figure
	data-slot="code-block"
	class={cls('overflow-hidden rounded-lg border bg-muted/50 text-sm text-foreground', className)}
>
	<figcaption
		class="flex items-center justify-between gap-3 border-b bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
	>
		<span class="font-mono">{languageLabel}</span>
		{#if copyable}
			<CopyButton
				value={code}
				{copyLabel}
				{copiedLabel}
				variant="ghost"
				size="icon"
				class="size-7"
			/>
		{/if}
	</figcaption>
	<!-- eslint-disable svelte/no-at-html-tags -- highlight.js escapes code before rendering -->
	<pre class="overflow-x-auto p-3 whitespace-normal">
		{#if splitLines}
			<code class="hljs block font-mono">
				{#each lines as line, index (index)}
					<span
						data-slot="code-block-line"
						data-line={index + 1}
						class={cls('flex min-h-5', highlightedLineSet.has(index + 1) && 'bg-brand/10')}>
						{#if showLineNumbers}
							<span
								aria-hidden="true"
								class="w-8 shrink-0 pr-3 text-right text-muted-foreground/60 select-none"
								>{index + 1}</span
							>
						{/if}
						<span class={cls('min-w-0', wrap ? 'break-words whitespace-pre-wrap' : 'whitespace-pre')}
							>{@html line}</span
						>
					</span>
				{/each}
			</code>
		{:else}
			<code class={cls('hljs font-mono whitespace-pre', wrap && 'break-words whitespace-pre-wrap')}
				>{@html highlighted}</code
			>
		{/if}
	</pre>
	<!-- eslint-enable svelte/no-at-html-tags -->
</figure>
