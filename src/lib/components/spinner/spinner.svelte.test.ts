import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import SpinnerTest from './spinner.test.svelte';

test('renders an accessible loading indicator', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(SpinnerTest, { target });
	const spinner = target.querySelector('[data-slot="spinner"]');

	expect(spinner?.getAttribute('role')).toBe('status');
	expect(spinner?.getAttribute('aria-label')).toBe('Loading conversations');
	expect(spinner?.className).toContain('animate-spin');

	unmount(app);
	target.remove();
});
