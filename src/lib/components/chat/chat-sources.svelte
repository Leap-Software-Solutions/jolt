<script lang="ts" module>
	import type { ChatSource } from './types.js';

	export type Props = {
		sources: ChatSource[];
		title?: string;
		ariaLabel?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { BookOpenIcon, ExternalLinkIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';

	let { sources, title = 'Sources', ariaLabel = 'Sources', class: className }: Props = $props();
</script>

<section
	aria-label={ariaLabel}
	data-slot="chat-sources"
	class={cls('flex flex-col gap-2 text-xs', className)}
>
	<div class="flex items-center gap-1.5 text-muted-foreground">
		<BookOpenIcon class="size-3.5" />
		<span class="font-medium">{title}</span>
	</div>

	<div class="flex flex-wrap gap-1.5">
		{#each sources as source, index (source.href ?? `${source.label}-${index}`)}
			{#if source.href}
				<a
					href={source.href}
					target="_blank"
					rel="noreferrer"
					title={source.description}
					data-slot="chat-source"
					class="inline-flex max-w-full items-center gap-1 rounded-md border bg-background px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
				>
					<span class="truncate">{source.label}</span>
					<ExternalLinkIcon class="size-3 shrink-0" />
				</a>
			{:else}
				<span
					title={source.description}
					data-slot="chat-source"
					class="inline-flex max-w-full items-center gap-1 rounded-md border bg-background px-2 py-1 text-muted-foreground"
				>
					<span class="truncate">{source.label}</span>
				</span>
			{/if}
		{/each}
	</div>
</section>
