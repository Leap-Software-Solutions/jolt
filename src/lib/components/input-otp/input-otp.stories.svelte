<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import InputOTP from './input-otp.svelte';
	import type { Props as InputOTPProps } from './types.js';

	const { Story } = defineMeta({
		title: 'Forms/Input OTP',
		component: InputOTP,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			length: 6,
			ariaLabel: 'Verification code',
		},
	});
</script>

<script lang="ts">
	let value = $state('');
	let completed = $state('');
</script>

{#snippet template(args: InputOTPProps)}
	<div class="flex flex-col items-center gap-3">
		<InputOTP
			{...args}
			bind:value
			onComplete={(next) => {
				completed = next;
			}}
		/>
		<p class="text-xs text-muted-foreground" aria-live="polite">
			Value: {value || '—'} · Completed: {completed || '—'}
		</p>
	</div>
{/snippet}

{#snippet filledTemplate(args: InputOTPProps)}
	<InputOTP {...args} value="123456" />
{/snippet}

<Story name="Default" {template} />

<Story name="Four digits" args={{ length: 4 }} {template} />

<Story name="Filled" template={filledTemplate} />

<Story name="Invalid" args={{ invalid: true }} {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />
