import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import PaginationTest from './pagination.test.svelte';

test('changes pages with the next button and page triggers', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(PaginationTest, { target });
	const next = target.querySelector<HTMLButtonElement>('[data-slot="pagination-next"]');
	const pageOne = target.querySelector<HTMLElement>(
		'[data-slot="pagination-page"][data-value="1"]',
	);

	expect(next).not.toBeNull();
	expect(pageOne?.getAttribute('aria-current')).toBe('page');

	await userEvent.click(next!);
	await tick();

	expect(target.querySelector('[data-testid="page"]')?.textContent).toBe('2');

	const pageFour = target.querySelector<HTMLElement>(
		'[data-slot="pagination-page"][data-value="4"]',
	);

	await userEvent.click(pageFour!);
	await tick();

	expect(target.querySelector('[data-testid="page"]')?.textContent).toBe('4');

	unmount(app);
	target.remove();
});
