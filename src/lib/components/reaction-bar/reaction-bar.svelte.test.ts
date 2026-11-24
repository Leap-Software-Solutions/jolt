import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import ReactionBar from './reaction-bar.svelte';
import ReactionBarTest from './reaction-bar.test.svelte';

test('renders labelled reaction toggles and hides zero counts', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBarTest, { target });
	await tick();

	const group = target.querySelector('[role="group"]');
	expect(group?.getAttribute('aria-label')).toBe('Retro card reactions');

	const buttons = Array.from(target.querySelectorAll<HTMLButtonElement>('[data-slot="reaction"]'));
	expect(buttons).toHaveLength(3);
	expect(buttons[0].getAttribute('aria-label')).toBe('Agree, 2 reactions');
	expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
	expect(buttons[1].getAttribute('aria-label')).toBe('Question, 1 reaction, selected');
	expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
	expect(buttons[2].getAttribute('aria-label')).toBe('Celebrate, no reactions');
	expect(buttons[2].querySelector('[data-slot="reaction-count"]')).toBeNull();

	unmount(app);
	target.remove();
});

test('toggles a reaction on and updates its count optimistically', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBarTest, { target });
	await tick();

	const button = target.querySelector<HTMLButtonElement>('[data-slot="reaction"]');
	await userEvent.click(button!);
	await tick();

	expect(button?.getAttribute('aria-pressed')).toBe('true');
	expect(button?.getAttribute('aria-label')).toBe('Agree, 3 reactions, selected');
	expect(target.querySelector('[data-testid="state"]')?.textContent).toContain('agree:3:true');
	expect(target.querySelector('[data-testid="changes"]')?.textContent).toContain('agree:3:true');

	unmount(app);
	target.remove();
});

test('toggles an active reaction off and removes its count at zero', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBarTest, { target });
	await tick();

	const active = Array.from(
		target.querySelectorAll<HTMLButtonElement>('[data-slot="reaction"]'),
	).find((button) => button.getAttribute('aria-pressed') === 'true');
	await userEvent.click(active!);
	await tick();

	expect(active?.getAttribute('aria-pressed')).toBe('false');
	expect(active?.getAttribute('aria-label')).toBe('Question, no reactions');
	expect(active?.querySelector('[data-slot="reaction-count"]')).toBeNull();
	expect(target.querySelector('[data-testid="state"]')?.textContent).toContain('question:0:false');

	unmount(app);
	target.remove();
});

test('keeps reactions independent', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBarTest, { target });
	await tick();

	const buttons = target.querySelectorAll<HTMLButtonElement>('[data-slot="reaction"]');
	await userEvent.click(buttons[0]);
	await userEvent.click(buttons[2]);
	await tick();

	expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
	expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
	expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
	expect(target.querySelector('[data-testid="state"]')?.textContent).toContain(
		'agree:3:true|question:1:true|celebrate:1:true',
	);

	unmount(app);
	target.remove();
});

test('disables every reaction when disabled', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBarTest, { target, props: { disabled: true } });
	await tick();

	const buttons = Array.from(target.querySelectorAll<HTMLButtonElement>('[data-slot="reaction"]'));
	expect(buttons.every((button) => button.disabled)).toBe(true);

	unmount(app);
	target.remove();
});

test('renders nothing when there are no reactions', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(ReactionBar, { target, props: { reactions: [] } });
	await tick();

	expect(target.querySelector('[data-slot="reaction-bar"]')).toBeNull();

	unmount(app);
	target.remove();
});
