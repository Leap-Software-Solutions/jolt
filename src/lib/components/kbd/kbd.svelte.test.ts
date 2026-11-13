import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import KbdTest from './kbd.test.svelte';

test('renders keyboard text in a semantic kbd element', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(KbdTest, { target });
	const kbd = target.querySelector('[data-slot="kbd"]');

	expect(kbd?.tagName).toBe('KBD');
	expect(kbd?.textContent).toBe('⌘K');

	unmount(app);
	target.remove();
});
