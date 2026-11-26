import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import CodeBlockTest from './code-block.test.svelte';

test('highlights code and exposes a copy control', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CodeBlockTest, { target });
	const block = target.querySelector('[data-slot="code-block"]');

	expect(block?.textContent).toContain('typescript');
	expect(block?.querySelector('code')?.innerHTML).toContain('hljs-keyword');
	expect(block?.querySelector('button')?.getAttribute('aria-label')).toBe('Copy code');

	unmount(app);
	target.remove();
});

test('renders numbered lines and highlighted ranges', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CodeBlockTest, {
		target,
		props: {
			code: 'const value = 1;\nreturn value;',
			showLineNumbers: true,
			highlightLines: [2],
		},
	});
	const lines = target.querySelectorAll<HTMLElement>('[data-slot="code-block-line"]');

	expect(lines.length).toBe(2);
	expect(lines[0]?.textContent).toContain('1');
	expect(lines[1]?.textContent).toContain('2');
	expect(lines[1]?.className).toContain('bg-brand/10');

	unmount(app);
	target.remove();
});
