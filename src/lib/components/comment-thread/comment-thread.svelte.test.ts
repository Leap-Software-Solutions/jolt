import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import CommentThread from './comment-thread.svelte';
import type { CommentThreadComment } from './types.js';

const comments: CommentThreadComment[] = [
	{
		id: 'c1',
		author: { name: 'Ada Lovelace', initials: 'AL' },
		body: 'Please keep the **existing import order**.',
		timestamp: new Date('2026-01-01T12:00:00Z'),
	},
	{
		id: 'c2',
		author: { name: 'Grace Hopper', initials: 'GH' },
		body: 'Agreed. I will update the fixture.',
	},
];

test('renders comments, timestamps, and quote callbacks', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onQuote = vi.fn();

	const app = mount(CommentThread, {
		target,
		props: { comments, onQuote },
	});
	await tick();

	expect(target.querySelectorAll('[data-slot="comment-thread-comment"]')).toHaveLength(2);
	expect(target.textContent).toContain('Ada Lovelace');
	expect(target.textContent).toContain('existing import order');
	expect(target.querySelector('[data-slot="time-ago"]')?.getAttribute('datetime')).toBe(
		'2026-01-01T12:00:00.000Z',
	);

	const quote = Array.from(target.querySelectorAll<HTMLButtonElement>('button')).find(
		(button) => button.textContent?.trim() === 'Quote reply',
	);
	await userEvent.click(quote!);
	expect(onQuote).toHaveBeenCalledWith(comments[0]);

	unmount(app);
	target.remove();
});

test('submits a reply from the composer', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onSubmit = vi.fn();

	const app = mount(CommentThread, {
		target,
		props: { comments, onSubmit },
	});
	await tick();

	const textarea = target.querySelector<HTMLTextAreaElement>('textarea');
	const submit = Array.from(target.querySelectorAll<HTMLButtonElement>('button')).find(
		(button) => button.textContent?.trim() === 'Reply',
	);
	expect(submit?.disabled).toBe(true);

	await userEvent.type(textarea!, 'A new reply');
	expect(submit?.disabled).toBe(false);

	await userEvent.click(submit!);
	expect(onSubmit).toHaveBeenCalledWith('A new reply');

	unmount(app);
	target.remove();
});

test('toggles the resolved state and hides the composer', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onResolvedChange = vi.fn();

	const app = mount(CommentThread, {
		target,
		props: { comments, resolved: true, onResolvedChange },
	});
	await tick();

	expect(target.textContent).toContain('Resolved');
	expect(target.querySelector('textarea')).toBeNull();
	expect(target.textContent).not.toContain('Quote reply');

	const reopen = Array.from(target.querySelectorAll<HTMLButtonElement>('button')).find(
		(button) => button.textContent?.trim() === 'Reopen',
	);
	await userEvent.click(reopen!);
	expect(onResolvedChange).toHaveBeenCalledWith(false);
	expect(target.textContent).toContain('Open');

	unmount(app);
	target.remove();
});

test('highlights a deep-linked comment and anchors its id', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(CommentThread, {
		target,
		props: { comments, highlightedCommentId: 'c2' },
	});
	await tick();

	const highlighted = target.querySelector('[data-comment-id="c2"]');
	expect(highlighted?.id).toBe('comment-c2');
	expect(highlighted?.getAttribute('data-highlighted')).toBe('true');
	expect(highlighted?.getAttribute('tabindex')).toBe('-1');
	expect(
		target.querySelector('[data-comment-id="c1"]')?.getAttribute('data-highlighted'),
	).toBeNull();

	unmount(app);
	target.remove();
});
