import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatSources from './chat-sources.svelte';

test('renders linked and plain sources', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatSources, {
		target,
		props: {
			sources: [
				{ label: 'Linked source', href: 'https://example.com/source' },
				{ label: 'Plain source' },
			],
		},
	});

	const sources = target.querySelectorAll('[data-slot="chat-source"]');
	expect(sources).toHaveLength(2);
	expect(sources[0]?.tagName).toBe('A');
	expect(sources[0]?.getAttribute('href')).toBe('https://example.com/source');
	expect(sources[1]?.tagName).toBe('SPAN');

	unmount(app);
	target.remove();
});
