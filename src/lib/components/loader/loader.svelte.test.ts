import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Loader from './loader.svelte';

test('renders a labelled three-dot loading state', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(Loader, { target });
	const loader = target.querySelector('[data-slot="loader"]');

	expect(loader?.getAttribute('role')).toBe('status');
	expect(loader?.getAttribute('aria-label')).toBe('Loading');
	expect(loader?.querySelectorAll('.jolt-loader-dot')).toHaveLength(3);

	unmount(app);
	target.remove();
});

test('can be decorative when composed inside another live region', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(Loader, { target, props: { decorative: true } });
	const loader = target.querySelector('[data-slot="loader"]');

	expect(loader?.getAttribute('role')).toBeNull();
	expect(loader?.getAttribute('aria-hidden')).toBe('true');

	unmount(app);
	target.remove();
});
