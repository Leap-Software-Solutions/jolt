import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ImageLightbox from './image-lightbox.svelte';

const images = [
	{ src: 'https://example.com/one.jpg', alt: 'First image', caption: 'First caption' },
	{ src: 'https://example.com/two.jpg', alt: 'Second image', caption: 'Second caption' },
];

test('navigates images and closes the lightbox', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ImageLightbox, {
		target,
		props: { images, open: true },
	});
	await tick();

	const dialog = document.querySelector('[data-slot="image-lightbox"]');
	const firstImage = document.querySelector<HTMLImageElement>('[data-slot="image-lightbox-image"]');

	expect(dialog).not.toBeNull();
	expect(firstImage?.getAttribute('alt')).toBe('First image');
	expect(dialog?.textContent).toContain('1 / 2');
	expect(dialog?.textContent).toContain('First caption');

	await userEvent.click(document.querySelector<HTMLButtonElement>('[aria-label="Next image"]')!);
	await tick();

	expect(
		document
			.querySelector<HTMLImageElement>('[data-slot="image-lightbox-image"]')
			?.getAttribute('alt'),
	).toBe('Second image');
	expect(dialog?.textContent).toContain('2 / 2');

	await userEvent.keyboard('{ArrowLeft}');
	await tick();

	expect(
		document
			.querySelector<HTMLImageElement>('[data-slot="image-lightbox-image"]')
			?.getAttribute('alt'),
	).toBe('First image');

	await userEvent.click(
		document.querySelector<HTMLButtonElement>('[aria-label="Close image preview"]')!,
	);
	await tick();

	expect(document.querySelector('[data-slot="image-lightbox"]')).toBeNull();

	unmount(app);
	target.remove();
});
