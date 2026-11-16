<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Attachment from './attachment.svelte';
	import AttachmentList from './attachment-list.svelte';
	import type { AttachmentItem } from './types.js';

	const { Story } = defineMeta({
		title: 'Data display/Attachments',
		component: AttachmentList,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	const releaseNotes = `# Release notes

## Added

- Generic attachment chips
- Markdown and plain-text previews
- Download actions for files with a URL

> Open Preview to render this Markdown, or Code to inspect the source.
`;

	const attachments: AttachmentItem[] = [
		{
			id: 'image',
			name: 'office-interior.jpg',
			size: 184320,
			type: 'image/jpeg',
			href: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
			alt: 'A hallway between glass-panel doors',
		},
		{
			id: 'markdown',
			name: 'release-notes.md',
			size: 4096,
			type: 'text/markdown',
			content: releaseNotes,
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
			id: 'archive',
			name: 'design-assets.zip',
			size: 2400000,
			type: 'application/zip',
			href: 'https://example.com/design-assets.zip',
		},
	];

	const shortAttachment: AttachmentItem = {
		id: 'short',
		name: 'handoff.txt',
		size: 1200,
		type: 'text/plain',
	};
</script>

{#snippet listTemplate()}
	<div class="w-[36rem] max-w-full">
		<AttachmentList {attachments} />
	</div>
{/snippet}

{#snippet chipTemplate()}
	<div class="flex flex-wrap items-center justify-center gap-2">
		<Attachment attachment={attachments[0]} size="sm" />
		<Attachment attachment={shortAttachment} size="default" removable />
	</div>
{/snippet}

<Story name="List" template={listTemplate} />

<Story name="Chip sizes" template={chipTemplate} />
