import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import ChatMarkdown from './chat-markdown.svelte';

test('renders safe Markdown and strips scripts', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatMarkdown, {
		target,
		props: {
			content: '# Hello\n\n<script>alert(1)</script>\n\n~~Removed~~\n\n[Link](https://example.com)',
		},
	});
	await tick();

	const markdown = target.querySelector('[data-slot="chat-markdown"]');

	expect(markdown?.querySelector('h1')?.textContent).toBe('Hello');
	expect(markdown?.querySelector('script')).toBeNull();
	expect(markdown?.querySelector('del')?.textContent).toBe('Removed');
	expect(markdown?.querySelector('a')?.getAttribute('href')).toBe('https://example.com');

	unmount(app);
	target.remove();
});

test('highlights fenced code blocks after rendering', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatMarkdown, {
		target,
		props: { content: '```typescript\nconst message: string = "Hello";\n```' },
	});
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 0));

	expect(target.querySelector('pre code')?.innerHTML).toContain('hljs-keyword');

	unmount(app);
	target.remove();
});
