<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatComposer from './chat-composer.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat Composer',
		component: ChatComposer,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	import { Kbd } from '../kbd/index.js';
	import { Select } from '../select/index.js';
	import { Separator } from '../separator/index.js';
	import { ToggleGroup } from '../toggle-group/index.js';
	import ChatAttachments from './chat-attachments.svelte';
	import type { ChatAttachment } from './types.js';

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

	let model = $state('jolt-balanced');
	let effort = $state('medium');
	let attachments = $state<ChatAttachment[]>([]);
	let nextAttachmentId = 1;

	function handleFiles(files: File[]): void {
		attachments = [
			...attachments,
			...files.map((file) => ({
				id: String(nextAttachmentId++),
				name: file.name,
				size: file.size,
				type: file.type,
			})),
		];
	}

	function removeAttachment(attachment: ChatAttachment): void {
		attachments = attachments.filter((item) => item.id !== attachment.id);
	}
</script>

<Story name="Default" asChild>
	<div class="w-[34rem] max-w-full">
		<ChatComposer />
	</div>
</Story>

<Story name="Loading" asChild>
	<div class="w-[34rem] max-w-full">
		<ChatComposer loading value="Draft a migration plan" />
	</div>
</Story>

<Story name="With toolbar" asChild>
	<div class="w-[34rem] max-w-full">
		<ChatComposer>
			{#snippet toolbar()}
				<span class="flex items-center gap-1 text-xs text-muted-foreground">
					<Kbd>Enter</Kbd> to send
				</span>
			{/snippet}
		</ChatComposer>
	</div>
</Story>

<Story name="With controls" asChild>
	<div class="w-[34rem] max-w-full">
		<ChatComposer>
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
		</ChatComposer>
	</div>
</Story>

<Story name="File drops" asChild>
	<div class="grid w-[34rem] max-w-full gap-2">
		{#if attachments.length > 0}
			<ChatAttachments {attachments} removable onRemove={removeAttachment} />
		{/if}
		<ChatComposer onFiles={handleFiles} />
		<p class="text-xs text-muted-foreground">
			Drop files onto the composer, or use this callback to connect an upload flow.
		</p>
	</div>
</Story>
