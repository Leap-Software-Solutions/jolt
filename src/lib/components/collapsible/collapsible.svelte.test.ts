import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import CollapsibleTest from './collapsible.test.svelte';

test('toggles the collapsible content and bound state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CollapsibleTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="collapsible-trigger"]');
	const content = target.querySelector<HTMLElement>('[data-slot="collapsible-content"]');

	expect(trigger).not.toBeNull();
	expect(content?.hasAttribute('hidden')).toBe(true);

	await userEvent.click(trigger!);
	await tick();

	expect(target.querySelector('[data-testid="open"]')?.textContent).toBe('true');
	expect(content?.hasAttribute('hidden')).toBe(false);
	expect(target.textContent).toContain('Hidden details');
	expect(trigger?.getAttribute('aria-expanded')).toBe('true');

	unmount(app);
	target.remove();
});
