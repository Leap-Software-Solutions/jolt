import { mount, tick, unmount } from 'svelte';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatActionsTest from './chat-actions.test.svelte';

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

test('copies message content through the shared clipboard helper', async () => {
	const writeText = vi.fn(async (): Promise<void> => {});
	stubClipboard(writeText);

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatActionsTest, { target });
	const copy = target.querySelector<HTMLButtonElement>('button[aria-label="Copy message"]');

	copy!.click();
	await vi.waitFor(() => {
		expect(target.querySelector('[data-testid="copied"]')?.textContent).toBe('A response');
	});

	expect(writeText).toHaveBeenCalledWith('A response');
	expect(copy?.getAttribute('aria-label')).toBe('Copied');

	unmount(app);
	target.remove();
});

test('shows a copy failure state when the clipboard rejects', async () => {
	const writeText = vi.fn(async (): Promise<void> => {
		throw new Error('Permission denied');
	});
	stubClipboard(writeText);

	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatActionsTest, { target });
	const copy = target.querySelector<HTMLButtonElement>('button[aria-label="Copy message"]');

	copy!.click();
	await vi.waitFor(() => {
		expect(target.querySelector('[data-testid="copy-failed"]')?.textContent).toBe('yes');
	});

	expect(copy?.getAttribute('aria-label')).toBe('Copy failed');

	unmount(app);
	target.remove();
});
