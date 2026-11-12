<script lang="ts" module>
	import { CircleAlertIcon, InfoIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as AlertProps } from './alert.svelte';
	import Alert from './alert.svelte';

	type TemplateArgs = Omit<AlertProps, 'children' | 'icon'>;

	const { Story } = defineMeta({
		title: 'Feedback/Alert',
		component: Alert,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'destructive', 'brand'],
			},
		},
		args: {
			title: 'Heads up',
			description: 'Your changes are saved locally and will sync shortly.',
		},
	});
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-96">
		<Alert {...args} />
	</div>
{/snippet}

{#snippet iconTemplate(args: TemplateArgs)}
	<div class="w-96">
		<Alert icon={InfoIcon} {...args} />
	</div>
{/snippet}

{#snippet destructiveTemplate(args: TemplateArgs)}
	<div class="w-96">
		<Alert icon={CircleAlertIcon} {...args} />
	</div>
{/snippet}

{#snippet bodyTemplate(args: TemplateArgs)}
	<div class="w-96">
		<Alert {...args}>
			<ul class="list-disc ps-4 text-sm text-muted-foreground">
				<li>Run the test suite</li>
				<li>Review the changelog</li>
			</ul>
		</Alert>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With icon" template={iconTemplate} />

<Story
	name="Brand"
	args={{
		variant: 'brand',
		title: 'New in Jolt',
		description: 'Select and Combobox are ready to use.',
	}}
	template={iconTemplate}
/>

<Story
	name="Destructive"
	args={{
		variant: 'destructive',
		title: 'Could not save',
		description: 'Check your connection and try again.',
	}}
	template={destructiveTemplate}
/>

<Story
	name="Custom body"
	args={{ title: 'Release checklist', description: undefined }}
	template={bodyTemplate}
/>
