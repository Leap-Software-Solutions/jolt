import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import ChatApprovalRequest from './chat-approval-request.svelte';
import ChatApprovalRequestTest from './chat-approval-request.test.svelte';

test('renders an assistant approval request and reports the decision', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onApprove = vi.fn();

	const app = mount(ChatApprovalRequest, {
		target,
		props: {
			name: 'Jolt',
			initials: 'J',
			timestamp: 'Just now',
			effect: { label: 'External write', tone: 'warning' },
			title: 'Publish release notes',
			onApprove,
		},
	});
	await tick();

	expect(target.querySelector('[data-slot="chat-approval-request"]')).not.toBeNull();
	const message = target.querySelector('[data-slot="chat-message"]');
	expect(message?.getAttribute('aria-label')).toBe('Jolt approval request');
	expect(message?.textContent).toContain('Jolt');
	expect(message?.textContent).toContain('External write');
	expect(message?.textContent).toContain('Publish release notes');

	const approve = target.querySelector<HTMLButtonElement>(
		'[data-slot="approval-bar-actions"] button',
	);
	expect(approve?.textContent?.trim()).toBe('Approve');

	await approve?.click();
	expect(onApprove).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});

test('forwards custom actions and lock state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onCustom = vi.fn();

	const app = mount(ChatApprovalRequestTest, {
		target,
		props: {
			name: 'Jolt',
			title: 'Publish release notes',
			locked: true,
			lockReason: 'Automated runs cannot publish outside the workspace.',
			onCustom,
		},
	});
	await tick();

	const lockReason = target.querySelector<HTMLElement>('[data-slot="approval-bar-lock"]');
	const custom = target.querySelector<HTMLButtonElement>(
		'[data-slot="approval-bar-actions"] button',
	);
	expect(custom?.textContent?.trim()).toBe('More actions');
	expect(custom?.disabled).toBe(true);
	expect(custom?.getAttribute('aria-describedby')).toBe(lockReason?.id);
	expect(target.textContent).toContain('Automated runs cannot publish outside the workspace.');

	await custom?.click();
	expect(onCustom).not.toHaveBeenCalled();

	unmount(app);
	target.remove();
});

test('renders a resolved request without actions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ChatApprovalRequest, {
		target,
		props: {
			name: 'Jolt',
			title: 'Publish release notes',
			status: 'approved',
			onApprove: () => {},
		},
	});
	await tick();

	expect(target.querySelector('[data-slot="approval-bar-status"]')?.textContent).toContain(
		'Approved',
	);
	expect(target.querySelector('[data-slot="approval-bar-actions"]')).toBeNull();

	unmount(app);
	target.remove();
});
