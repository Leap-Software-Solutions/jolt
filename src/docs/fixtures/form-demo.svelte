<script lang="ts">
	import * as v from 'valibot';
	import { Button, createForm, TextField } from '../../lib/index.js';

	const schema = v.object({
		email: v.pipe(v.string(), v.nonEmpty('Enter your email.'), v.email('Enter a valid email.')),
		name: v.pipe(v.string(), v.nonEmpty('Enter your name.')),
	});

	let submitted = $state(false);

	const form = createForm({
		schema,
		initialValues: { email: '', name: '' },
		onSubmit: async () => {
			submitted = true;
		},
	});
</script>

<form onsubmit={form.handleSubmit} novalidate class="grid w-80 gap-4">
	<TextField label="Email" type="email" bind:value={form.values.email} error={form.errors.email} />
	<TextField
		label="Name"
		placeholder="Ada Lovelace"
		bind:value={form.values.name}
		error={form.errors.name}
	/>

	<Button type="submit" disabled={form.isSubmitting}>
		{form.isSubmitting ? 'Saving…' : 'Save profile'}
	</Button>

	{#if submitted}
		<p class="text-xs text-muted-foreground">Profile submitted.</p>
	{/if}
</form>
