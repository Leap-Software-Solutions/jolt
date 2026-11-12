import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import HoverCardTest from './hover-card.test.svelte';

test('opens the card when the trigger is hovered', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(HoverCardTest, { target });
	const trigger = target.querySelector<HTMLAnchorElement>('a');

	expect(trigger).not.toBeNull();

	await userEvent.hover(trigger!);
	await new Promise((resolve) => setTimeout(resolve, 20));
	await tick();

	expect(document.body.textContent).toContain('Engineer profile');

	unmount(app);
	target.remove();
});
