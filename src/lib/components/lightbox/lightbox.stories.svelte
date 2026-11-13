<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import Lightbox from './lightbox.svelte';
	import type { LightboxImage, LightboxItem } from './types.js';

	const { Story } = defineMeta({
		title: 'Overlays/Lightbox',
		component: Lightbox,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	const gallery: LightboxImage[] = [
		{
			kind: 'image',
			src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
			alt: 'A team collaborating around a table',
			caption: 'Studio session',
			downloadUrl:
				'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
		},
		{
			kind: 'image',
			src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
			alt: 'A hallway between glass-panel doors',
			caption: 'Office interior',
		},
		{
			kind: 'image',
			src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
			alt: 'A mountain lake at dusk',
			caption: 'Offsite landscape',
		},
	];

	const releaseNotes = `# Release notes

## Added

- Full-screen media previews
- Markdown and plain-text attachments
- Download actions for files with a URL

> Preview mode renders Markdown; code mode shows the source.

\`\`\`typescript
const preview = { format: 'markdown' };
\`\`\`
`;

	const mixed: LightboxItem[] = [
		gallery[1],
		{
			kind: 'text',
			title: 'release-notes.md',
			format: 'markdown',
			content: releaseNotes,
			downloadUrl: `data:text/markdown;charset=utf-8,${encodeURIComponent(releaseNotes)}`,
		},
		{
			kind: 'text',
			title: 'handoff.txt',
			format: 'text',
			content: 'Handoff notes\n\n- Review the copy\n- Check the responsive layout\n- Ship it',
		},
		{
			kind: 'file',
			name: 'design-assets.zip',
			mimeType: 'application/zip',
			downloadUrl: 'https://example.com/design-assets.zip',
		},
	];
</script>

{#snippet galleryTemplate()}
	<Lightbox items={gallery} ariaLabel="Reference images">
		{#snippet trigger(triggerProps)}
			<Button {...triggerProps} variant="outline">Open gallery</Button>
		{/snippet}
	</Lightbox>
{/snippet}

{#snippet singleTemplate()}
	<Lightbox items={[gallery[0]]} ariaLabel="Reference image">
		{#snippet trigger(triggerProps)}
			<Button {...triggerProps} variant="outline">Open image</Button>
		{/snippet}
	</Lightbox>
{/snippet}

{#snippet mixedTemplate()}
	<Lightbox items={mixed} ariaLabel="Attachment previews">
		{#snippet trigger(triggerProps)}
			<Button {...triggerProps} variant="outline">Open mixed preview</Button>
		{/snippet}
	</Lightbox>
{/snippet}

<Story name="Gallery" template={galleryTemplate} />

<Story name="Single image" template={singleTemplate} />

<Story name="Mixed media" template={mixedTemplate} />
