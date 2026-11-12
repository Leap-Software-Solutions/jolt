import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ProgressTest from './progress.test.svelte';

test('exposes the current value and percentage to assistive technology', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ProgressTest, { target });
	const progress = target.querySelector<HTMLElement>('[role="progressbar"]');
	const bar = target.querySelector<HTMLElement>('[data-slot="progress-bar"]');

	expect(progress?.getAttribute('aria-valuenow')).toBe('40');
	expect(progress?.getAttribute('aria-valuemin')).toBe('0');
	expect(progress?.getAttribute('aria-valuemax')).toBe('100');
	expect(bar?.style.width).toBe('40%');
	expect(target.textContent).toContain('40%');

	unmount(app);
	target.remove();
});
