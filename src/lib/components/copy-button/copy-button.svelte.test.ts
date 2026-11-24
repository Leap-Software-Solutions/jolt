import { mount, tick, unmount } from 'svelte';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import CopyButtonTest from './copy-button.test.svelte';

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

afterEach(() => {
	if (originalClipboard) {
		Object.defineProperty(navigator, 'clipboard', originalClipboard);
		return;
	}
	Reflect.deleteProperty(navigator, 'clipboard');
});

function stubClipboard(writeText: (value: string) => Promise<void>): void {
	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value: { writeText },
	});
}

test('copies the value and shows success feedback', async () => {
	const writeText = vi.fn(async (): Promise<void> => {});
	stubClipboard(writeText);

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CopyButtonTest, { target });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('button');
	expect(button?.getAttribute('aria-label')).toBe('Copy invite link');

	await userEvent.click(button!);
	await tick();

	expect(writeText).toHaveBeenCalledWith('https://leap.online/invite/retro-42');
	expect(button?.getAttribute('aria-label')).toBe('Copied');
	expect(target.querySelector('[data-testid="copied"]')?.textContent).toBe(
		'https://leap.online/invite/retro-42',
	);
	expect(target.querySelector('[role="status"]')?.textContent).toContain('Copied.');

	unmount(app);
	target.remove();
});

test('switches a labelled button to the copied label', async () => {
	const writeText = vi.fn(async (): Promise<void> => {});
	stubClipboard(writeText);

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CopyButtonTest, { target, props: { label: 'Copy invite link' } });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('button');
	expect(button?.textContent).toContain('Copy invite link');

	await userEvent.click(button!);
	await tick();

	expect(button?.textContent).toContain('Copied');

	unmount(app);
	target.remove();
});

test('shows a persistent failure state when the clipboard rejects', async () => {
	const writeText = vi.fn(async (): Promise<void> => {
		throw new Error('Permission denied');
	});
	stubClipboard(writeText);

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CopyButtonTest, { target });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('button');
	await userEvent.click(button!);
	await tick();

	expect(button?.getAttribute('aria-label')).toBe('Copy failed');
	expect(target.querySelector('[data-testid="failed"]')?.textContent).toBe('failed');
	expect(target.querySelector('[role="status"]')?.textContent).toContain('Copy failed.');

	unmount(app);
	target.remove();
});

test('disables the button when the clipboard API is unavailable', async () => {
	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value: undefined,
	});

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CopyButtonTest, { target });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('button');
	expect(button?.disabled).toBe(true);
	expect(button?.getAttribute('aria-label')).toBe('Clipboard unavailable');

	unmount(app);
	target.remove();
});
