import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import AccordionTest from './accordion.test.svelte';

test('opens an item and updates the bound value', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(AccordionTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="accordion-trigger"]');

	expect(trigger).not.toBeNull();
	expect(trigger?.getAttribute('aria-expanded')).toBe('false');

	await userEvent.click(trigger!);
	await tick();

	expect(trigger?.getAttribute('aria-expanded')).toBe('true');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('shipping');
	expect(target.textContent).toContain('Shipping content');

	await userEvent.click(trigger!);
	await tick();

	expect(trigger?.getAttribute('aria-expanded')).toBe('false');
	expect(target.querySelector('[data-testid="value"]')?.textContent).toBe('');

	unmount(app);
	target.remove();
});
