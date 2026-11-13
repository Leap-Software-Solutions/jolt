import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatActionsTest from './chat-actions.test.svelte';

test('regenerates and records feedback', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatActionsTest, { target });
	const regenerate = target.querySelector<HTMLButtonElement>(
		'button[aria-label="Regenerate response"]',
	);
	const good = target.querySelector<HTMLButtonElement>('button[aria-label="Good response"]');

	expect(regenerate).not.toBeNull();
	expect(good).not.toBeNull();
	expect(regenerate?.hasAttribute('title')).toBe(false);
	expect(good?.hasAttribute('title')).toBe(false);

	regenerate!.click();
	good!.click();
	await tick();

	expect(target.querySelector('[data-testid="regenerated"]')?.textContent).toBe('yes');
	expect(good?.getAttribute('aria-pressed')).toBe('true');

	await userEvent.click(good!);
	expect(good?.getAttribute('aria-pressed')).toBe('false');

	unmount(app);
	target.remove();
});
