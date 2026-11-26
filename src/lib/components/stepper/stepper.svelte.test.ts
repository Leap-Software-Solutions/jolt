import { mount, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import StepperTest from './stepper.test.svelte';
import type { StepperStep } from './types.js';

const steps: StepperStep[] = [
	{ id: 'build', label: 'Build', description: 'Compile the package', status: 'complete' },
	{ id: 'test', label: 'Test', status: 'current' },
	{ id: 'deploy', label: 'Deploy', status: 'pending' },
	{ id: 'verify', label: 'Verify', status: 'error' },
];

test('renders an accessible horizontal stepper', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(StepperTest, { target, props: { steps } });
	await tick();

	const stepper = target.querySelector<HTMLOListElement>('[data-slot="stepper"]');
	const items = target.querySelectorAll<HTMLLIElement>('[data-slot="stepper-step"]');

	expect(stepper?.tagName).toBe('OL');
	expect(stepper?.getAttribute('aria-label')).toBe('Release progress');
	expect(stepper?.dataset.orientation).toBe('horizontal');
	expect(items).toHaveLength(4);
	expect(items[1]?.getAttribute('aria-current')).toBe('step');
	expect(items[0]?.querySelector('[data-slot="stepper-marker"]')?.className).toContain(
		'bg-success',
	);
	expect(items[1]?.querySelector('[data-slot="stepper-marker"]')?.className).toContain('bg-info');
	expect(items[0]?.textContent).toContain('Build');
	expect(items[0]?.querySelector('.text-success')).not.toBeNull();
	expect(items[1]?.querySelector('.text-info')).not.toBeNull();
	expect(items[3]?.querySelector('.text-destructive')).not.toBeNull();
	expect(items[2]?.getAttribute('aria-current')).toBeNull();
	expect(items[0]?.textContent).toContain('Complete');
	expect(items[3]?.textContent).toContain('Error');
	expect(items[2]?.querySelector('[data-slot="stepper-marker"]')?.getAttribute('data-status')).toBe(
		'pending',
	);

	unmount(app);
	target.remove();
});

test('supports a vertical orientation', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(StepperTest, {
		target,
		props: { steps, orientation: 'vertical' },
	});
	await tick();

	expect(target.querySelector('[data-slot="stepper"]')?.getAttribute('data-orientation')).toBe(
		'vertical',
	);
	expect(target.querySelectorAll('[data-slot="stepper-connector"]')).toHaveLength(3);
	expect(
		target.querySelector('[data-slot="stepper-step"] a [data-slot="stepper-connector"]'),
	).toBeNull();

	unmount(app);
	target.remove();
});

test('supports click handlers and hrefs on steps', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const onStepActivate = vi.fn();
	const linkedSteps: StepperStep[] = [
		{ id: 'build', label: 'Build', status: 'complete', href: '#build' },
		{ id: 'test', label: 'Test', status: 'current' },
	];
	const app = mount(StepperTest, {
		target,
		props: { steps: linkedSteps, onStepActivate },
	});
	await tick();

	const controls = target.querySelectorAll<HTMLElement>(
		'[data-slot="stepper-step"] button, [data-slot="stepper-step"] a',
	);
	expect(controls).toHaveLength(2);
	expect(controls[0]?.getAttribute('href')).toBe('#build');

	await controls[1]?.click();
	expect(onStepActivate).toHaveBeenCalledWith(linkedSteps[1]);

	unmount(app);
	target.remove();
});

test('keeps vertical connectors outside linked steps', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const linkedSteps: StepperStep[] = [
		{ id: 'build', label: 'Build', status: 'complete', href: '#build' },
		{ id: 'test', label: 'Test', status: 'current', href: '#test' },
	];
	const app = mount(StepperTest, {
		target,
		props: { steps: linkedSteps, orientation: 'vertical' },
	});
	await tick();

	const connectors = target.querySelectorAll('[data-slot="stepper-connector"]');
	expect(connectors).toHaveLength(1);
	expect(connectors[0]?.closest('a')).toBeNull();
	expect(connectors[0]?.parentElement?.getAttribute('data-slot')).toBe('stepper-step');

	unmount(app);
	target.remove();
});
