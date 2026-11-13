<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Chat from './chat.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat',
		component: Chat,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	import { Button } from '../button/index.js';
	import { Select } from '../select/index.js';
	import { Separator } from '../separator/index.js';
	import { ToggleGroup } from '../toggle-group/index.js';
	import type { ChatMessageData } from './types.js';

	const models = [
		{ value: 'jolt-fast', label: 'Jolt Fast' },
		{ value: 'jolt-balanced', label: 'Jolt Balanced' },
		{ value: 'jolt-deep', label: 'Jolt Deep' },
	];

	const efforts = [
		{ value: 'low', label: 'Low' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'high', label: 'High' },
	];

	let messages = $state<ChatMessageData[]>([
		{
			id: '1',
			role: 'user',
			content: 'Can you explain how the import rules are configured?',
			name: 'Ada',
		},
		{
			id: '2',
			role: 'assistant',
			content:
				'The rules sort imports in one contiguous block, then enforce `import type` for type-only imports.\n\n```typescript\nimport { Button } from "@leap/jolt";\n```',
			name: 'Jolt',
		},
	]);
	let value = $state('');
	let model = $state('jolt-balanced');
	let effort = $state('medium');

	let longMessages = $state<ChatMessageData[]>(
		Array.from({ length: 12 }, (_, index) => ({
			id: `long-${index}`,
			role: index % 2 === 0 ? 'user' : 'assistant',
			name: index % 2 === 0 ? 'Ada' : 'Jolt',
			content:
				index % 2 === 0
					? `Question ${index / 2 + 1}: can you walk through the component usage?`
					: `Answer ${Math.floor(index / 2) + 1}: yes, compose it with the primitives or use the batteries-included surface.`,
		})),
	);
	let nextLongId = 13;
	let longValue = $state('');

	function appendLongMessage(): void {
		const id = String(nextLongId++);
		longMessages = [
			...longMessages,
			{
				id,
				role: 'user',
				content: `Follow-up ${id}: keep the conversation pinned to the latest message.`,
				name: 'Ada',
			},
		];
	}

	function handleLongSend(text: string): void {
		const id = String(nextLongId++);
		longMessages = [...longMessages, { id, role: 'user', content: text, name: 'Ada' }];
		longValue = '';
	}

	function handleSend(text: string): void {
		messages = [
			...messages,
			{
				id: String(messages.length + 1),
				role: 'user',
				content: text,
				name: 'Ada',
			},
		];
		value = '';
	}
</script>

<Story name="Default" asChild>
	<div class="h-[36rem] w-[42rem] max-w-full">
		<Chat {messages} bind:value onSend={handleSend} />
	</div>
</Story>

<Story name="Empty" asChild>
	<div class="h-[30rem] w-[42rem] max-w-full">
		<Chat messages={[]} bind:value onSend={handleSend}>
			{#snippet empty()}
				<p class="text-sm text-muted-foreground">Start a conversation to see messages here.</p>
			{/snippet}
		</Chat>
	</div>
</Story>

<Story name="Streaming" asChild>
	<div class="h-[30rem] w-[42rem] max-w-full">
		<Chat
			messages={[
				{ id: '1', role: 'user', content: 'Summarise the latest release.', name: 'Ada' },
				{
					id: '2',
					role: 'assistant',
					content: 'The release adds calendar ranges and polishes the component APIs.',
					name: 'Jolt',
					status: 'streaming',
				},
			]}
			bind:value
			loading
			onSend={handleSend}
		/>
	</div>
</Story>

<Story name="Auto-scroll" asChild>
	<div class="grid w-[42rem] max-w-full gap-3">
		<div class="h-[24rem]">
			<Chat messages={longMessages} bind:value={longValue} onSend={handleLongSend} />
		</div>
		<p class="text-xs text-muted-foreground">
			Scroll up to see the “scroll to latest” control, then append a message to return to the
			bottom.
		</p>
		<Button variant="outline" onclick={appendLongMessage}>Append a message</Button>
	</div>
</Story>

<Story name="User Markdown" asChild>
	<div class="h-[26rem] w-[42rem] max-w-full">
		<Chat
			messages={[
				{
					id: '1',
					role: 'user',
					name: 'Ada',
					content:
						'Please keep **this text readable** inside the user bubble. Inline `message` and a fenced block should also use the bubble colours:\n\n```typescript\nconst bubble = "user";\n```',
				},
				{
					id: '2',
					role: 'assistant',
					name: 'Jolt',
					content:
						'It inherits the bubble colour instead of overriding it with the page foreground.',
				},
			]}
		/>
	</div>
</Story>

<Story name="With composer controls" asChild>
	<div class="h-[34rem] w-[42rem] max-w-full">
		<Chat {messages} bind:value onSend={handleSend}>
			{#snippet toolbar()}
				<Select
					items={models}
					bind:value={model}
					ariaLabel="Model"
					triggerClass="h-8 w-auto border-0 bg-transparent px-2 text-xs shadow-none"
				/>
				<Separator orientation="vertical" class="h-5" />
				<ToggleGroup items={efforts} bind:value={effort} size="sm" ariaLabel="Reasoning effort" />
			{/snippet}
		</Chat>
	</div>
</Story>
