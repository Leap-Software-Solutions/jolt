<script lang="ts">
	import { CheckIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Avatar } from '../avatar/index.js';
	import { Badge } from '../badge/index.js';
	import { Button } from '../button/index.js';
	import { Markdown } from '../markdown/index.js';
	import { Textarea } from '../textarea/index.js';
	import { TimeAgo } from '../time-ago/index.js';
	import type { CommentThreadComment, Props } from './types.js';

	let {
		comments,
		resolved = $bindable(false),
		draft = $bindable(''),
		highlightedCommentId,
		ariaLabel = 'Comments',
		resolvedLabel = 'Resolved',
		openLabel = 'Open',
		resolveLabel = 'Resolve',
		reopenLabel = 'Reopen',
		quoteLabel = 'Quote reply',
		replyLabel = 'Reply',
		placeholder = 'Write a reply…',
		composerLabel = 'Reply',
		onQuote,
		onSubmit,
		onResolvedChange,
		class: className,
	}: Props = $props();

	function toggleResolved(): void {
		resolved = !resolved;
		onResolvedChange?.(resolved);
	}

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		if (!draft.trim()) return;
		onSubmit?.(draft);
	}

	function isHighlighted(comment: CommentThreadComment): boolean {
		return highlightedCommentId === comment.id;
	}
</script>

<section
	data-slot="comment-thread"
	aria-label={ariaLabel}
	class={cls('flex flex-col gap-3', className)}
>
	<div class="flex items-center justify-between gap-3 border-b pb-3">
		<Badge
			label={resolved ? resolvedLabel : openLabel}
			variant={resolved ? 'success' : 'neutral'}
			icon={resolved ? CheckIcon : undefined}
		/>
		<Button variant="ghost" size="sm" onclick={toggleResolved}>
			{resolved ? reopenLabel : resolveLabel}
		</Button>
	</div>

	<ol class="flex flex-col gap-4">
		{#each comments as comment (comment.id)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<li
				id={`comment-${comment.id}`}
				data-slot="comment-thread-comment"
				data-comment-id={comment.id}
				data-highlighted={isHighlighted(comment) ? 'true' : undefined}
				tabindex={isHighlighted(comment) ? -1 : undefined}
				class={cls(
					'-mx-2 scroll-mt-4 rounded-lg px-2 py-2 transition-colors',
					isHighlighted(comment) && 'bg-brand/5 ring-1 ring-brand/30',
				)}
			>
				<article aria-label={`${comment.author.name} comment`} class="flex gap-3">
					<Avatar
						src={comment.author.avatarSrc}
						alt={comment.author.name}
						initials={comment.author.initials}
						size="sm"
						class="mt-0.5 shrink-0"
					/>
					<div class="min-w-0 flex-1">
						<div class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
							<span class="text-sm font-medium">{comment.author.name}</span>
							{#if comment.timestamp}
								<TimeAgo date={comment.timestamp} class="text-xs text-muted-foreground" />
							{/if}
						</div>
						<Markdown content={comment.body} class="mt-1.5" />
						{#if onQuote && !resolved}
							<Button
								variant="ghost"
								size="sm"
								class="mt-1 -ml-2 h-7 px-2 text-xs"
								onclick={() => onQuote?.(comment)}
							>
								{quoteLabel}
							</Button>
						{/if}
					</div>
				</article>
			</li>
		{/each}
	</ol>

	{#if !resolved && onSubmit}
		<form class="flex flex-col gap-2 border-t pt-3" onsubmit={handleSubmit}>
			<Textarea bind:value={draft} rows={3} {placeholder} aria-label={composerLabel} />
			<div class="flex justify-end">
				<Button type="submit" size="sm" disabled={!draft.trim()}>{replyLabel}</Button>
			</div>
		</form>
	{/if}
</section>
