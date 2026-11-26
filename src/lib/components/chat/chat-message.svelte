<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { DateInput } from '../../utils/format.js';
	import type { ChatMessageStatus, ChatRole } from './types.js';

	export type Props = {
		role?: ChatRole;
		name?: string;
		avatarSrc?: string;
		initials?: string;
		timestamp?: DateInput;
		status?: ChatMessageStatus;
		ariaLabel?: string;
		actions?: Snippet;
		children?: Snippet;
		class?: string;
		bubbleClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Avatar } from '../avatar/index.js';
	import { TimeAgo } from '../time-ago/index.js';
	import ChatLoader from './chat-loader.svelte';

	let {
		role = 'assistant',
		name,
		avatarSrc,
		initials,
		timestamp,
		status = 'complete',
		ariaLabel,
		actions,
		children,
		class: className,
		bubbleClass,
	}: Props = $props();

	const isUser = $derived(role === 'user');
	const isSystem = $derived(role === 'system');
	const showAvatar = $derived(!isSystem && Boolean(avatarSrc || initials));
	const messageLabel = $derived(ariaLabel ?? `${name ?? role} message`);
</script>

<article
	data-slot="chat-message"
	data-role={role}
	aria-label={messageLabel}
	class={cls(
		'flex w-full gap-3',
		isUser && 'flex-row-reverse',
		isSystem && 'justify-center',
		className,
	)}
>
	{#if showAvatar}
		<Avatar
			src={avatarSrc}
			alt={name ?? messageLabel}
			{initials}
			size="sm"
			class="mt-0.5 shrink-0"
		/>
	{/if}

	<div
		class={cls(
			'flex min-w-0 flex-col gap-1',
			isUser && 'items-end',
			isSystem && 'items-center',
			!isSystem && 'max-w-[85%]',
		)}
	>
		{#if name || timestamp}
			<div class="flex items-baseline gap-2 px-1 text-xs text-muted-foreground">
				{#if name}
					<span class="font-medium text-foreground">{name}</span>
				{/if}
				{#if timestamp}
					<TimeAgo date={timestamp} />
				{/if}
			</div>
		{/if}

		<div
			data-slot="chat-message-bubble"
			class={cls(
				'min-w-0 text-sm leading-relaxed',
				isSystem && 'text-xs text-muted-foreground',
				!isSystem && 'rounded-2xl px-4 py-2.5',
				isUser && 'jolt-chat-user-bubble rounded-br-md bg-primary text-primary-foreground',
				role === 'assistant' && 'rounded-bl-md bg-muted text-foreground',
				role === 'tool' && 'w-full rounded-lg border bg-card text-card-foreground',
				bubbleClass,
			)}
		>
			{@render children?.()}
		</div>

		{#if status === 'streaming' || status === 'sending'}
			<div class="px-1">
				<ChatLoader label={status === 'sending' ? 'Sending message' : 'Generating response'} />
			</div>
		{:else if status === 'error'}
			<p class="px-1 text-xs text-destructive" role="alert">Message failed to send.</p>
		{/if}

		{#if actions}
			<div class="flex items-center gap-1 px-1">
				{@render actions()}
			</div>
		{/if}
	</div>
</article>
