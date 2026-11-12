import * as v from 'valibot';
import { expect, test } from 'vitest';
import { createForm } from './create-form.svelte.js';
import { toFieldErrors } from './superform-errors.js';

const schema = v.object({
	email: v.pipe(v.string(), v.nonEmpty('Enter your email.'), v.email('Enter a valid email.')),
	name: v.pipe(v.string(), v.nonEmpty('Enter your name.')),
});

test('validates values and exposes field errors', () => {
	const form = createForm({
		schema,
		initialValues: { email: '', name: '' },
	});

	expect(form.validate()).toBe(false);
	expect(form.errors.email).toBe('Enter your email.');
	expect(form.errors.name).toBe('Enter your name.');

	form.values.email = 'ada@leap-online.com';
	form.values.name = 'Ada Lovelace';

	expect(form.validate()).toBe(true);
	expect(form.errors).toEqual({});
});

test('submits parsed values and resets to the initial state', async () => {
	let submitted: v.InferOutput<typeof schema> | undefined;

	const form = createForm({
		schema,
		initialValues: { email: 'ada@leap-online.com', name: 'Ada Lovelace' },
		onSubmit: (values) => {
			submitted = values;
		},
	});

	await form.handleSubmit();

	expect(submitted).toEqual({ email: 'ada@leap-online.com', name: 'Ada Lovelace' });
	expect(form.isSubmitting).toBe(false);

	form.values.email = 'grace@leap-online.com';
	form.reset();

	expect(form.values.email).toBe('ada@leap-online.com');
});

test('collapses Superforms field errors to the first message', () => {
	expect(
		toFieldErrors({
			email: ['Enter your email.', 'Use the company address.'],
			name: 'Enter your name.',
			role: undefined,
		}),
	).toEqual({
		email: 'Enter your email.',
		name: 'Enter your name.',
	});
});
