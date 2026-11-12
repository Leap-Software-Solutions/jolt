import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ConfirmDialogTest from './confirm-dialog.test.svelte';

function getButton(label: string): HTMLButtonElement {
	const button = Array.from(document.querySelectorAll('button')).find(
		(candidate) => candidate.textContent?.trim() === label,
	);

	if (!button) {
		throw new Error(`Button "${label}" not found`);
	}

	return button;
}

test('cancels and confirms the dialog', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ConfirmDialogTest, { target });

	await userEvent.click(getButton('Open confirmation'));
	await tick();

	expect(document.querySelector('[role="alertdialog"]')).not.toBeNull();
	expect(document.body.textContent).toContain('Delete asset');

	await userEvent.click(getButton('Cancel'));
	await tick();

	expect(document.querySelector('[role="alertdialog"]')).toBeNull();
	expect(target.querySelector('[data-testid="confirmed"]')?.textContent).toBe('false');

	await userEvent.click(getButton('Open confirmation'));
	await tick();
	await userEvent.click(getButton('Delete'));
	await tick();

	expect(target.querySelector('[data-testid="confirmed"]')?.textContent).toBe('true');
	expect(document.querySelector('[role="alertdialog"]')).toBeNull();

	unmount(app);
	target.remove();
});
