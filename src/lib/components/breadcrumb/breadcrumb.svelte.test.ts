import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import BreadcrumbTest from './breadcrumb.test.svelte';

test('collapses middle items into an overflow menu', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(BreadcrumbTest, { target });
	const overflow = target.querySelector<HTMLElement>('[data-slot="breadcrumb-overflow"]');
	const current = target.querySelector<HTMLElement>('[aria-current="page"]');

	expect(overflow).not.toBeNull();
	expect(current?.textContent).toContain('Components');
	expect(target.textContent).not.toContain('Engineering');

	await userEvent.click(overflow!.querySelector('button')!);
	await tick();

	expect(document.body.textContent).toContain('Engineering');
	expect(document.body.textContent).toContain('Design systems');

	unmount(app);
	target.remove();
});
