<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '../button/index.js';
	import ImageLightbox from './image-lightbox.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Image lightbox',
		component: ImageLightbox,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	import type { LightboxImage } from './types.js';

	const gallery: LightboxImage[] = [
		{
			src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
			alt: 'A team collaborating around a table',
			caption: 'Studio session',
		},
		{
			src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
			alt: 'A hallway between glass-panel doors',
			caption: 'Office interior',
		},
		{
			src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
			alt: 'A mountain lake at dusk',
			caption: 'Offsite landscape',
		},
	];
</script>

{#snippet template()}
	<ImageLightbox images={gallery} ariaLabel="Reference images">
		{#snippet trigger(triggerProps)}
			<Button {...triggerProps} variant="outline">Open gallery</Button>
		{/snippet}
	</ImageLightbox>
{/snippet}

<Story name="Gallery" {template} />

{#snippet singleTemplate()}
	<ImageLightbox images={[gallery[0]]} ariaLabel="Reference image">
		{#snippet trigger(triggerProps)}
			<Button {...triggerProps} variant="outline">Open image</Button>
		{/snippet}
	</ImageLightbox>
{/snippet}

<Story name="Single image" template={singleTemplate} />
