<script lang="ts" module>
	export type Props = {
		code: string;
		language?: string;
		label?: string;
		copyable?: boolean;
		copyLabel?: string;
		copiedLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { CheckIcon, ClipboardIcon } from '@lucide/svelte';
	import { highlightCode } from '../../utils/highlight.js';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		code,
		language = 'text',
		label,
		copyable = true,
		copyLabel = 'Copy code',
		copiedLabel = 'Copied',
		class: className,
	}: Props = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const highlighted = $derived(highlightCode(code, language));
	const languageLabel = $derived(label ?? language);

	async function copyCode(): Promise<void> {
		await navigator.clipboard.writeText(code);
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1800);
	}
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
			<Button
				variant="ghost"
				size="icon"
				class="size-7"
				aria-label={copied ? copiedLabel : copyLabel}
				title={copied ? copiedLabel : copyLabel}
				onclick={copyCode}
			>
				{#if copied}
					<CheckIcon class="text-brand-strong" />
				{:else}
					<ClipboardIcon />
				{/if}
			</Button>
		{/if}
	</figcaption>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- highlight.js escapes code before rendering -->
	<pre class="overflow-x-auto p-3"><code class="hljs font-mono">{@html highlighted}</code></pre>
</figure>
