<script lang="ts" module>
	export type ChatFeedback = 'up' | 'down';

	export type Props = {
		content?: string;
		feedback?: ChatFeedback | null;
		onCopy?: (content: string) => void;
		onCopyError?: (error: unknown) => void;
		onRegenerate?: () => void;
		onFeedback?: (feedback: ChatFeedback) => void;
		copyLabel?: string;
		copiedLabel?: string;
		copyErrorLabel?: string;
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
		CircleXIcon,
		ClipboardIcon,
		RotateCcwIcon,
		ThumbsDownIcon,
		ThumbsUpIcon,
	} from '@lucide/svelte';
	import { copyText } from '../../utils/clipboard.js';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Toggle } from '../toggle/index.js';
	import { Tooltip } from '../tooltip/index.js';

	let {
		content,
		feedback = $bindable(null),
		onCopy,
		onCopyError,
		onRegenerate,
		onFeedback,
		copyLabel = 'Copy message',
		copiedLabel = 'Copied',
		copyErrorLabel = 'Copy failed',
		regenerateLabel = 'Regenerate response',
		feedbackUpLabel = 'Good response',
		feedbackDownLabel = 'Bad response',
		feedbackGroupLabel = 'Response feedback',
		disabled,
		class: className,
	}: Props = $props();

	let copyStatus = $state<'idle' | 'copied' | 'error'>('idle');
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const copyStateLabel = $derived(getCopyStateLabel());

	function getCopyStateLabel(): string {
		if (copyStatus === 'copied') return copiedLabel;
		if (copyStatus === 'error') return copyErrorLabel;
		return copyLabel;
	}

	function resetCopyStatus(): void {
		if (copyTimer) {
			clearTimeout(copyTimer);
			copyTimer = undefined;
		}
		copyStatus = 'idle';
	}

	async function copyMessage(): Promise<void> {
		if (!content) return;
		resetCopyStatus();

		try {
			await copyText(content);
			onCopy?.(content);
			copyStatus = 'copied';
			copyTimer = setTimeout(() => {
				copyStatus = 'idle';
				copyTimer = undefined;
			}, 1800);
		} catch (error: unknown) {
			copyStatus = 'error';
			onCopyError?.(error);
		}
	}

	$effect(() => {
		return () => {
			if (copyTimer) clearTimeout(copyTimer);
		};
	});

	function selectFeedback(next: ChatFeedback, pressed: boolean): void {
		const value = pressed ? next : null;
		feedback = value;
		if (value) onFeedback?.(value);
	}
</script>

{#if content || onRegenerate || onFeedback}
	<div data-slot="chat-actions" class={cls('flex items-center gap-0.5', className)}>
		{#if content}
			<Tooltip text={copyStateLabel}>
				{#snippet trigger(triggerProps)}
					<Button
						{...triggerProps}
						variant="ghost"
						size="icon"
						class="size-8"
						aria-label={copyStateLabel}
						{disabled}
						onclick={copyMessage}
					>
						{#if copyStatus === 'copied'}
							<CheckIcon class="text-brand-strong" />
						{:else if copyStatus === 'error'}
							<CircleXIcon class="text-destructive" />
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
