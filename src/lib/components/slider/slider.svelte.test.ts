import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import SliderTest from './slider.test.svelte';

test('changes the value with the keyboard', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SliderTest, { target });
	const thumb = target.querySelector<HTMLElement>('[data-slot="slider-thumb"]');

	expect(thumb).not.toBeNull();
	expect(thumb?.getAttribute('aria-valuenow')).toBe('20');

	thumb?.focus();
	await userEvent.keyboard('{ArrowRight}');
	await tick();

	expect(thumb?.getAttribute('aria-valuenow')).toBe('21');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('21');

	unmount(app);
	target.remove();
});
