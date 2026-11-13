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
