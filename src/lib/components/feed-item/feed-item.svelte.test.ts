import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import FeedItemTest from './feed-item.test.svelte';

test('renders title, meta, unread state, and trailing content', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(FeedItemTest, { target });
	await tick();

	expect(target.querySelector('[data-slot="feed-item"]')?.getAttribute('data-unread')).toBe('true');
	expect(target.querySelector('[data-slot="feed-item-title"]')?.textContent).toBe(
		'Deployment completed',
	);
	expect(target.querySelector('[data-slot="feed-item-meta"]')?.textContent).toBe(
		'Production · 3 minutes ago',
	);
	expect(target.querySelector('[data-slot="feed-item-trailing"]')).not.toBeNull();

	unmount(app);
	target.remove();
});

test('activates the row from its keyboard-operable button', async () => {
	let activations = 0;
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(FeedItemTest, {
		target,
		props: {
			onActivate: () => {
				activations += 1;
			},
		},
	});
	await tick();

	const activation = target.querySelector<HTMLButtonElement>(
		'button[aria-label="Deployment completed, unread"]',
	);
	expect(activation).not.toBeNull();

	await userEvent.click(activation!);
	await tick();

	expect(activations).toBe(1);
	expect(target.querySelector('[data-testid="activations"]')?.textContent).toBe('1');

	unmount(app);
	target.remove();
});

test('keeps trailing actions separate from row activation', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(FeedItemTest, { target });
	await tick();

	await userEvent.click(target.querySelector<HTMLButtonElement>('[data-testid="trailing"]')!);
	await tick();

	expect(target.querySelector('[data-testid="trailing-clicks"]')?.textContent).toBe('1');
	expect(target.querySelector('[data-testid="activations"]')?.textContent).toBe('0');

	unmount(app);
	target.remove();
});

test('uses a link overlay when an href is provided', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(FeedItemTest, { target, props: { href: '/activity/42' } });
	await tick();

	const link = target.querySelector<HTMLAnchorElement>(
		'a[aria-label="Deployment completed, unread"]',
	);
	expect(link?.getAttribute('href')).toBe('/activity/42');
	expect(target.querySelector('button[aria-label="Deployment completed, unread"]')).toBeNull();

	unmount(app);
	target.remove();
});
