import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatLoader from './chat-loader.svelte';

test('renders a labelled live loading state', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatLoader, { target });
	const loader = target.querySelector('[data-slot="chat-loader"]');

	expect(loader?.getAttribute('role')).toBe('status');
	expect(loader?.getAttribute('aria-label')).toBe('Thinking');
	expect(loader?.querySelectorAll('.jolt-loader-dot')).toHaveLength(3);
	expect(loader?.textContent).toContain('Thinking');

	unmount(app);
	target.remove();
});
