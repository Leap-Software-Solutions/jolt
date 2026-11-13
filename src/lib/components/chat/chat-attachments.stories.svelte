<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatAttachments from './chat-attachments.svelte';
	import type { ChatAttachment } from './types.js';

	const { Story } = defineMeta({
		title: 'Chat/Chat attachments',
		component: ChatAttachments,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: { attachments: ChatAttachment[]; removable?: boolean })}
	<div class="w-[36rem] max-w-full">
		<ChatAttachments {...args} />
	</div>
{/snippet}

<Story
	name="Default"
	args={{
		attachments: [
			{
				id: '1',
				name: 'office-interior.jpg',
				size: 184320,
				type: 'image/jpeg',
				href: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
				alt: 'A hallway between glass-panel doors',
			},
			{ id: '2', name: 'release-notes.md', size: 4096, type: 'text/markdown' },
			{ id: '3', name: 'bundle.zip', size: 2400000, type: 'application/zip' },
		],
	}}
	{template}
/>

<Story
	name="Removable"
	args={{
		removable: true,
		attachments: [
			{ id: '1', name: 'component-guidelines.pdf', size: 284000, type: 'application/pdf' },
			{ id: '2', name: 'notes.txt', size: 1200, type: 'text/plain' },
		],
	}}
	{template}
/>
