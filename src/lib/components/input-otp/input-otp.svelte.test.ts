import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import InputOTP from './input-otp.svelte';

function getSlots(target: HTMLElement): string[] {
	return [...target.querySelectorAll('[data-slot="input-otp-slot"]')].map(
		(slot) => slot.textContent?.trim() ?? '',
	);
}

test('renders numeric slots and wires the hidden input', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(InputOTP, {
		target,
		props: { ariaLabel: 'Verification code', describedBy: 'code-hint' },
	});
	await tick();

	const input = target.querySelector<HTMLInputElement>('[data-slot="input-otp-input"]');
	expect(getSlots(target)).toEqual(['', '', '', '', '', '']);
	expect(input?.getAttribute('aria-label')).toBe('Verification code');
	expect(input?.getAttribute('aria-describedby')).toBe('code-hint');
	expect(input?.getAttribute('maxlength')).toBe('6');
	expect(input?.getAttribute('inputmode')).toBe('numeric');
	expect(input?.getAttribute('autocomplete')).toBe('one-time-code');
	expect(input?.getAttribute('pattern')).toBe('[0-9]*');

	unmount(app);
	target.remove();
});

test('filters non-digits and completes once the code is full', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const onValueChange = vi.fn();
	const onComplete = vi.fn();
	const app = mount(InputOTP, { target, props: { onValueChange, onComplete } });
	await tick();

	const input = target.querySelector<HTMLInputElement>('[data-slot="input-otp-input"]');
	await userEvent.click(input!);
	await tick();

	expect(target.querySelector('[data-slot="input-otp-slot"]')?.getAttribute('data-active')).toBe(
		'true',
	);

	await userEvent.type(input!, '12a3456');
	await tick();

	expect(getSlots(target)).toEqual(['1', '2', '3', '4', '5', '6']);
	expect(onValueChange).toHaveBeenLastCalledWith('123456');
	expect(onComplete).toHaveBeenCalledTimes(1);
	expect(onComplete).toHaveBeenCalledWith('123456');

	unmount(app);
	target.remove();
});

test('rounds the first and last slots', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(InputOTP, { target });
	await tick();

	const slots = target.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]');
	expect(slots[0]?.className).toContain('rounded-s-lg');
	expect(slots[slots.length - 1]?.className).toContain('rounded-e-lg');

	unmount(app);
	target.remove();
});

test('moves the active slot to a clicked filled slot', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(InputOTP, { target, props: { value: '123456' } });
	await tick();

	const input = target.querySelector<HTMLInputElement>('[data-slot="input-otp-input"]');
	input!.focus();
	await tick();

	const slots = target.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]');
	const slot = slots[3];
	const rect = slot.getBoundingClientRect();
	input!.dispatchEvent(
		new MouseEvent('click', {
			bubbles: true,
			clientX: rect.left + rect.width / 2,
			clientY: rect.top + rect.height / 2,
		}),
	);
	await tick();

	expect(slot.getAttribute('data-active')).toBe('true');
	expect(input?.selectionStart).toBe(3);

	unmount(app);
	target.remove();
});

test('sanitises pasted values and exposes invalid and disabled state', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const app = mount(InputOTP, {
		target,
		props: {
			length: 4,
			invalid: true,
			disabled: true,
			ariaLabel: 'Backup code',
		},
	});
	await tick();

	const input = target.querySelector<HTMLInputElement>('[data-slot="input-otp-input"]');
	expect(target.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(4);
	expect(input?.getAttribute('aria-invalid')).toBe('true');
	expect(input?.disabled).toBe(true);

	input!.removeAttribute('disabled');
	input!.value = '12 34';
	input!.dispatchEvent(new Event('input', { bubbles: true }));
	await tick();

	expect(getSlots(target)).toEqual(['1', '2', '3', '4']);

	unmount(app);
	target.remove();
});
