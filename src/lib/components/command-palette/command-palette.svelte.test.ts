import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import CommandPaletteTest from './command-palette.test.svelte';

test('runs a command and closes the palette', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CommandPaletteTest, { target });
	const trigger = target.querySelector<HTMLButtonElement>('button');

	expect(trigger).not.toBeNull();

	await userEvent.click(trigger!);
	await tick();

	const item = document.querySelector<HTMLElement>(
		'[data-slot="command-palette-item"][data-value="save"]',
	);

	expect(item).not.toBeNull();

	await userEvent.click(item!);
	await tick();

	expect(target.querySelector('[data-testid="picked"]')?.textContent).toBe('save');
	expect(target.querySelector('[data-testid="open"]')?.textContent).toBe('false');

	unmount(app);
	target.remove();
});
