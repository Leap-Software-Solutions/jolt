import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import ChatToolCall from './chat-tool-call.svelte';

test('renders a tool call and expands its details', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatToolCall, {
		target,
		props: { name: 'search_codebase', status: 'success', summary: 'Found 3 files' },
	});
	await tick();

	const trigger = target.querySelector<HTMLButtonElement>('[data-slot="chat-tool-call"] button');
	expect(trigger?.textContent).toContain('search_codebase');
	expect(trigger?.textContent).toContain('Complete');

	await userEvent.click(trigger!);
	await tick();

	expect(target.querySelector('[data-slot="chat-tool-call"]')?.getAttribute('data-state')).toBe(
		'open',
	);

	unmount(app);
	target.remove();
});

test('shows approval actions and reports the chosen decision', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const onApprove = vi.fn();
	const onDeny = vi.fn();
	const onSession = vi.fn();
	const onBlock = vi.fn();
	const app = mount(ChatToolCall, {
		target,
		props: {
			name: 'delete_file',
			status: 'awaiting-approval',
			summary: 'Delete src/legacy.ts',
			approvalDescription: 'This will permanently remove the file.',
			onApprove,
			onDeny,
			allowOptions: [{ label: 'Allow for this session', onSelect: onSession }],
			approvalMenu: [{ label: 'Block tool', onSelect: onBlock }],
		},
	});
	await tick();

	expect(target.textContent).toContain('Awaiting approval');
	expect(target.textContent).toContain('This will permanently remove the file.');

	const buttons = Array.from(target.querySelectorAll<HTMLButtonElement>('button'));
	const allow = buttons.find((button) => button.textContent?.trim() === 'Allow');
	const deny = buttons.find((button) => button.textContent?.trim() === 'Deny');
	const allowMenu = target.querySelector<HTMLButtonElement>(
		'button[aria-label="More allow options"]',
	);
	const toolMenu = target.querySelector<HTMLButtonElement>(
		'button[aria-label="More tool options"]',
	);

	const actionButtons = Array.from(
		target.querySelectorAll<HTMLButtonElement>('[data-slot="chat-tool-approval"] button'),
	);
	expect(
		actionButtons.map((button) => button.getAttribute('aria-label') ?? button.textContent?.trim()),
	).toEqual(['More tool options', 'Deny', 'Allow', 'More allow options']);

	await userEvent.click(allow!);
	expect(onApprove).toHaveBeenCalledWith('once');

	await userEvent.click(allowMenu!);
	await tick();

	const allowItems = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));
	expect(allowItems.map((item) => item.textContent?.trim())).toEqual([
		'Always allow',
		'Allow for this session',
	]);

	await userEvent.click(allowItems.find((item) => item.textContent?.trim() === 'Always allow')!);
	await tick();
	expect(onApprove).toHaveBeenCalledWith('always');

	await userEvent.click(allowMenu!);
	await tick();
	await userEvent.click(
		Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
			(item) => item.textContent?.trim() === 'Allow for this session',
		)!,
	);
	await tick();
	expect(onSession).toHaveBeenCalledTimes(1);

	await userEvent.click(toolMenu!);
	await tick();

	const block = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
		(item) => item.textContent?.trim() === 'Block tool',
	);

	expect(block).not.toBeUndefined();

	await userEvent.click(block!);
	await tick();

	expect(onBlock).toHaveBeenCalledTimes(1);

	await userEvent.click(deny!);
	expect(onDeny).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});
