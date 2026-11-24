<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as EmailInputProps } from './email-input.svelte';
	import EmailInput from './email-input.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Email Input',
		component: EmailInput,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<script lang="ts">
	let value = $state(['ada@example.com']);

	type TemplateArgs = Omit<EmailInputProps, 'value'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="grid w-96 gap-2">
		<EmailInput bind:value ariaLabel="Invite emails" {...args} />
		<p class="text-xs text-muted-foreground">
			{value.length ? value.join(', ') : 'No invitees yet'}
		</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Invalid" args={{ invalid: true }} {template} />

<Story name="Max emails" args={{ maxTags: 3 }} {template} />
