import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import SplitButton from './split-button.svelte';

test('runs the primary action and a menu item', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const onAction = vi.fn();
	const onDraft = vi.fn();
	const app = mount(SplitButton, {
		target,
		props: {
			label: 'Save',
			items: [{ label: 'Save as draft', onSelect: onDraft }],
			onAction,
			menuLabel: 'More save options',
		},
	});
	await tick();

	const buttons = Array.from(target.querySelectorAll<HTMLButtonElement>('button'));
	const main = buttons.find((button) => button.textContent?.trim() === 'Save');
	const menu = target.querySelector<HTMLButtonElement>('button[aria-label="More save options"]');

	expect(main).not.toBeUndefined();
	expect(menu).not.toBeUndefined();

	await userEvent.click(main!);
	expect(onAction).toHaveBeenCalledTimes(1);

	await userEvent.click(menu!);
	await tick();

	const draft = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
		(item) => item.textContent?.trim() === 'Save as draft',
	);

	expect(draft).not.toBeUndefined();

	await userEvent.click(draft!);
	await tick();
	expect(onDraft).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});
