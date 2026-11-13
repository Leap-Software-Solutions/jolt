<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { ChatFeedback } from './chat-actions.svelte';
	import type { ChatMessageData } from './types.js';

	export type Props = {
		messages: ChatMessageData[];
		value?: string;
		placeholder?: string;
		inputLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		empty?: Snippet;
		message?: Snippet<[ChatMessageData]>;
		toolbar?: Snippet;
		onSend?: (value: string) => void;
		onStop?: () => void;
		onFiles?: (files: File[]) => void;
		onCopy?: (message: ChatMessageData) => void;
		onRegenerate?: (message: ChatMessageData) => void;
		onFeedback?: (message: ChatMessageData, feedback: ChatFeedback) => void;
		ariaLabel?: string;
		class?: string;
		viewportClass?: string;
		contentClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import ChatActions from './chat-actions.svelte';
	import ChatComposer from './chat-composer.svelte';
	import ChatMarkdown from './chat-markdown.svelte';
	import ChatMessage from './chat-message.svelte';
	import ChatViewport from './chat-viewport.svelte';

	let {
		messages,
		value = $bindable(''),
		placeholder,
		inputLabel,
		loading,
		disabled,
		empty,
		message: messageSnippet,
		onSend,
		onStop,
		onFiles,
		onCopy,
		onRegenerate,
		onFeedback,
		toolbar,
		ariaLabel = 'Conversation',
		class: className,
		viewportClass,
		contentClass,
	}: Props = $props();
</script>

<div data-slot="chat" class={cls('flex h-full min-h-0 flex-col gap-3', className)}>
	<ChatViewport {ariaLabel} class={cls('flex-1', viewportClass)}>
		{#if messages.length === 0 && empty}
			<div class="flex min-h-full items-center justify-center p-6">
				{@render empty()}
			</div>
		{:else}
			<div class={cls('grid gap-4 p-4', contentClass)}>
				{#each messages as chatMessage (chatMessage.id)}
					<ChatMessage
						role={chatMessage.role}
						name={chatMessage.name}
						avatarSrc={chatMessage.avatarSrc}
						initials={chatMessage.initials}
						timestamp={chatMessage.timestamp}
						status={chatMessage.status}
					>
						{#if messageSnippet}
							{@render messageSnippet(chatMessage)}
						{:else}
							<ChatMarkdown content={chatMessage.content} />
						{/if}

						{#snippet actions()}
							<ChatActions
								content={chatMessage.content}
								feedback={null}
								onCopy={onCopy ? () => onCopy(chatMessage) : undefined}
								onRegenerate={chatMessage.role === 'assistant' && onRegenerate
									? () => onRegenerate(chatMessage)
									: undefined}
								onFeedback={onFeedback
									? (feedback) => onFeedback(chatMessage, feedback)
									: undefined}
							/>
						{/snippet}
					</ChatMessage>
				{/each}
			</div>
		{/if}
	</ChatViewport>

	<ChatComposer
		bind:value
		{placeholder}
		{inputLabel}
		{loading}
		{disabled}
		{onSend}
		{onStop}
		{onFiles}
		{toolbar}
	/>
</div>
