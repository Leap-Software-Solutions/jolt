<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatAttachments from './chat-attachments.svelte';
	import type { ChatAttachment } from './types.js';

	const { Story } = defineMeta({
		title: 'Chat/Chat Attachments',
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
			{
				id: '2',
				name: 'release-notes.md',
				size: 4096,
				type: 'text/markdown',
				content: '# Release notes\n\n- Media previews\n- Markdown and text attachments',
				href: 'https://example.com/release-notes.md',
			},
			{
				id: 'source',
				name: 'theme.ts',
				type: 'text/plain',
				content: `export const accent = '#bba53d';`,
				href: 'https://example.com/theme.ts',
			},
			{
				id: '3',
				name: 'bundle.zip',
				size: 2400000,
				type: 'application/zip',
				href: 'https://example.com/bundle.zip',
			},
		],
	}}
	{template}
/>

<Story
	name="Removable"
	args={{
		removable: true,
		attachments: [
			{
				id: '1',
				name: 'component-guidelines.pdf',
				size: 284000,
				type: 'application/pdf',
				href: 'https://example.com/component-guidelines.pdf',
			},
			{
				id: '2',
				name: 'notes.txt',
				size: 1200,
				type: 'text/plain',
				content: 'Handoff notes\n\nReview the copy and responsive layout.',
				href: 'https://example.com/notes.txt',
			},
		],
	}}
	{template}
/>
