<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		title: string;
		meta?: string;
		leading?: Snippet;
		trailing?: Snippet;
		unread?: boolean;
		/** Renders the row as a link. Takes precedence over `onActivate`. */
		href?: string;
		/** Renders the row as a button. */
		onActivate?: () => void;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		title,
		meta,
		leading,
		trailing,
		unread = false,
		href,
		onActivate,
		class: className,
	}: Props = $props();

	const isInteractive = $derived(Boolean(href || onActivate));
	const activationLabel = $derived(unread ? `${title}, unread` : title);
</script>

<div
	data-slot="feed-item"
	data-unread={unread ? 'true' : undefined}
	class={cls(
		'group relative flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm',
		isInteractive && 'transition-colors hover:bg-muted/50',
		className,
	)}
>
	{#if href}
		<a
			{href}
			aria-label={activationLabel}
			class="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
		></a>
	{:else if onActivate}
		<button
			type="button"
			aria-label={activationLabel}
			onclick={onActivate}
			class="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
		></button>
	{/if}

	<div
		class={cls(
			'relative z-10 flex min-w-0 flex-1 items-start gap-3',
			isInteractive && 'pointer-events-none',
		)}
	>
		{#if leading}
			<div class="flex shrink-0 items-start">
				{@render leading()}
			</div>
		{/if}

		<div class="min-w-0 flex-1">
			<div class="flex min-w-0 items-center gap-2">
				{#if unread}
					<span class="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true"></span>
				{/if}
				<span
					data-slot="feed-item-title"
					class={cls('truncate', unread ? 'font-semibold' : 'font-medium')}
				>
					{title}
				</span>
			</div>
			{#if meta}
				<p data-slot="feed-item-meta" class="mt-0.5 truncate text-xs text-muted-foreground">
					{meta}
				</p>
			{/if}
		</div>

		{#if trailing}
			<div
				data-slot="feed-item-trailing"
				class={cls('shrink-0', isInteractive && 'pointer-events-auto')}
			>
				{@render trailing()}
			</div>
		{/if}
	</div>

	{#if unread && !isInteractive}
		<span class="sr-only">Unread</span>
	{/if}
</div>
