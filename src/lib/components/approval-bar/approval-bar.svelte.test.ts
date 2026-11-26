import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import ApprovalBar from './approval-bar.svelte';
import ApprovalBarTest from './approval-bar.test.svelte';

const effect = { label: 'External write', tone: 'warning' as const };

test('renders the effect and reports the built-in actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onApprove = vi.fn();
	const onReject = vi.fn();

	const app = mount(ApprovalBar, {
		target,
		props: {
			effect,
			title: 'Publish release notes',
			description: 'This sends the draft to the public changelog.',
			onApprove,
			onReject,
		},
	});
	await tick();

	expect(target.querySelector('[data-slot="approval-bar-effect"]')?.textContent).toContain(
		'External write',
	);
	expect(target.textContent).toContain('Publish release notes');

	const buttons = target.querySelectorAll<HTMLButtonElement>(
		'[data-slot="approval-bar-actions"] button',
	);
	expect([...buttons].map((button) => button.textContent?.trim())).toEqual(['Reject', 'Approve']);

	await buttons[0]?.click();
	await buttons[1]?.click();

	expect(onReject).toHaveBeenCalledTimes(1);
	expect(onApprove).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});

test('renders custom actions alongside the built-in actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onCustom = vi.fn();

	const app = mount(ApprovalBarTest, {
		target,
		props: {
			effect,
			onApprove: () => {},
			onReject: () => {},
			onCustom,
		},
	});
	await tick();

	const buttons = target.querySelectorAll<HTMLButtonElement>(
		'[data-slot="approval-bar-actions"] button',
	);
	expect([...buttons].map((button) => button.textContent?.trim())).toEqual([
		'More actions',
		'Reject',
		'Approve',
	]);

	await buttons[0]?.click();
	expect(onCustom).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});

test('disables custom and built-in actions and exposes the lock reason when locked', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onApprove = vi.fn();
	const onCustom = vi.fn();

	const app = mount(ApprovalBarTest, {
		target,
		props: {
			effect,
			title: 'Publish release notes',
			locked: true,
			lockReason: 'Automated runs cannot publish outside the workspace.',
			onApprove,
			onCustom,
		},
	});
	await tick();

	expect(target.querySelector('[data-slot="approval-bar-status"]')?.textContent).toContain(
		'Locked',
	);
	expect(target.textContent).toContain('Automated runs cannot publish outside the workspace.');

	const buttons = target.querySelectorAll<HTMLButtonElement>(
		'[data-slot="approval-bar-actions"] button',
	);
	expect(buttons).toHaveLength(2);
	expect([...buttons].every((button) => button.disabled)).toBe(true);

	const lockReason = target.querySelector<HTMLElement>('[data-slot="approval-bar-lock"]');
	expect(buttons[0]?.getAttribute('aria-describedby')).toBe(lockReason?.id);
	expect(buttons[1]?.getAttribute('aria-describedby')).toBe(lockReason?.id);

	await buttons[0]?.click();
	await buttons[1]?.click();
	expect(onCustom).not.toHaveBeenCalled();
	expect(onApprove).not.toHaveBeenCalled();

	unmount(app);
	target.remove();
});

test('shows an approved status without actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ApprovalBar, {
		target,
		props: { status: 'approved', title: 'Publish release notes', onApprove: () => {} },
	});
	await tick();

	expect(target.querySelector('[data-slot="approval-bar-status"]')?.textContent).toContain(
		'Approved',
	);
	expect(target.querySelector('[data-slot="approval-bar-actions"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('shows a rejected status without actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ApprovalBar, {
		target,
		props: { status: 'rejected', title: 'Publish release notes', onReject: () => {} },
	});
	await tick();

	expect(target.querySelector('[data-slot="approval-bar-status"]')?.textContent).toContain(
		'Rejected',
	);
	expect(target.querySelector('[data-slot="approval-bar-actions"]')).toBeNull();

	unmount(app);
	target.remove();
});
