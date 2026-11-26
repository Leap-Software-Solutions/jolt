import { mount, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import UserChip from './user-chip.svelte';

test('renders a user with metadata and presence', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(UserChip, {
		target,
		props: {
			name: 'Ada Lovelace',
			initials: 'AL',
			meta: 'Staff engineer',
			status: 'online',
		},
	});

	expect(target.textContent).toContain('Ada Lovelace');
	expect(target.textContent).toContain('Staff engineer');
	expect(target.querySelector('[data-slot="user-chip-meta"]')?.textContent).toContain(
		'Staff engineer',
	);
	expect(target.querySelector('[data-slot="avatar-status"]')?.getAttribute('aria-label')).toBe(
		'Online',
	);

	unmount(app);
	target.remove();
});

test('renders a labelled remove action when removable', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onRemove = vi.fn();

	const app = mount(UserChip, {
		target,
		props: { name: 'Ada Lovelace', initials: 'AL', onRemove },
	});
	const remove = target.querySelector<HTMLButtonElement>('button');

	expect(remove?.getAttribute('aria-label')).toBe('Remove Ada Lovelace');
	await userEvent.click(remove!);
	expect(onRemove).toHaveBeenCalledTimes(1);

	unmount(app);
	target.remove();
});

test('omits the remove action by default', () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(UserChip, {
		target,
		props: { name: 'Ada Lovelace', initials: 'AL' },
	});
	expect(target.querySelector('button')).toBeNull();

	unmount(app);
	target.remove();
});
