<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import { toast } from './index.js';
	import Toast, { type Props as ToastProps } from './toast.svelte';

	const { Story } = defineMeta({
		title: 'Feedback/Toast',
		component: Toast,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				story: {
					inline: false,
					height: '360px',
				},
			},
		},
		args: {
			position: 'bottom-right',
		},
	});

	type TemplateArgs = ToastProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="flex flex-wrap items-center justify-center gap-2">
		<Button
			variant="outline"
			onclick={() =>
				toast.success('Changes saved', {
					description: 'Your profile is up to date.',
				})}
		>
			Success toast
		</Button>
		<Button
			variant="outline"
			onclick={() =>
				toast.info('Heads up', {
					description: 'A new version is available.',
				})}
		>
			Info toast
		</Button>
		<Button
			variant="outline"
			onclick={() =>
				toast.error('Could not save', {
					description: 'Check your connection and try again.',
				})}
		>
			Error toast
		</Button>
		<Toast {...args} />
	</div>
{/snippet}

<Story name="Default" {template} />
