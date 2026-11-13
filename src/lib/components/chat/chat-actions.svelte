<script lang="ts" module>
	export type ChatFeedback = 'up' | 'down';

	export type Props = {
		content?: string;
		feedback?: ChatFeedback | null;
		onCopy?: (content: string) => void;
		onRegenerate?: () => void;
		onFeedback?: (feedback: ChatFeedback) => void;
		copyLabel?: string;
		copiedLabel?: string;
		regenerateLabel?: string;
		feedbackUpLabel?: string;
		feedbackDownLabel?: string;
		feedbackGroupLabel?: string;
		disabled?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import {
		CheckIcon,
		ClipboardIcon,
		RotateCcwIcon,
		ThumbsDownIcon,
		ThumbsUpIcon,
	} from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Toggle } from '../toggle/index.js';
	import { Tooltip } from '../tooltip/index.js';

	let {
		content,
		feedback = $bindable(null),
		onCopy,
		onRegenerate,
		onFeedback,
		copyLabel = 'Copy message',
		copiedLabel = 'Copied',
		regenerateLabel = 'Regenerate response',
		feedbackUpLabel = 'Good response',
		feedbackDownLabel = 'Bad response',
		feedbackGroupLabel = 'Response feedback',
		disabled,
		class: className,
	}: Props = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyMessage(): Promise<void> {
		if (!content) return;
		await navigator.clipboard.writeText(content);
		onCopy?.(content);
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1800);
	}

	function selectFeedback(next: ChatFeedback, pressed: boolean): void {
		const value = pressed ? next : null;
		feedback = value;
		if (value) onFeedback?.(value);
	}
</script>

{#if content || onRegenerate || onFeedback}
	<div data-slot="chat-actions" class={cls('flex items-center gap-0.5', className)}>
		{#if content}
			<Tooltip text={copied ? copiedLabel : copyLabel}>
				{#snippet trigger(triggerProps)}
					<Button
						{...triggerProps}
						variant="ghost"
						size="icon"
						class="size-8"
						aria-label={copied ? copiedLabel : copyLabel}
						{disabled}
						onclick={copyMessage}
					>
						{#if copied}
							<CheckIcon class="text-brand-strong" />
						{:else}
							<ClipboardIcon />
						{/if}
					</Button>
				{/snippet}
			</Tooltip>
		{/if}

		{#if onRegenerate}
			<Tooltip text={regenerateLabel}>
				{#snippet trigger(triggerProps)}
					<Button
						{...triggerProps}
						variant="ghost"
						size="icon"
						class="size-8"
						aria-label={regenerateLabel}
						{disabled}
						onclick={onRegenerate}
					>
						<RotateCcwIcon />
					</Button>
				{/snippet}
			</Tooltip>
		{/if}

		{#if onFeedback}
			<div role="group" aria-label={feedbackGroupLabel} class="flex items-center gap-0.5">
				<Tooltip text={feedbackUpLabel}>
					{#snippet trigger(triggerProps)}
						<Toggle
							{triggerProps}
							class="size-8 px-0 [&_svg]:size-4"
							ariaLabel={feedbackUpLabel}
							pressed={feedback === 'up'}
							{disabled}
							onPressedChange={(pressed) => selectFeedback('up', pressed)}
						>
							<ThumbsUpIcon />
						</Toggle>
					{/snippet}
				</Tooltip>
				<Tooltip text={feedbackDownLabel}>
					{#snippet trigger(triggerProps)}
						<Toggle
							{triggerProps}
							class="size-8 px-0 [&_svg]:size-4"
							ariaLabel={feedbackDownLabel}
							pressed={feedback === 'down'}
							{disabled}
							onPressedChange={(pressed) => selectFeedback('down', pressed)}
						>
							<ThumbsDownIcon />
						</Toggle>
					{/snippet}
				</Tooltip>
			</div>
		{/if}
	</div>
{/if}
