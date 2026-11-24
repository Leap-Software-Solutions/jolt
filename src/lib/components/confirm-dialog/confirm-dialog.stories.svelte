<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import ConfirmDialog, { type Props as ConfirmDialogProps } from './confirm-dialog.svelte';

	const { Story } = defineMeta({
		title: 'Patterns/Confirm Dialog',
		component: ConfirmDialog,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'Delete asset',
			description: 'This action cannot be undone. The asset will be removed for everyone.',
			confirmLabel: 'Delete asset',
			variant: 'destructive',
		},
	});
</script>

<script lang="ts">
	let open = $state(false);
	let confirmed = $state(false);
</script>

{#snippet template(args: Omit<ConfirmDialogProps, 'open' | 'trigger' | 'children' | 'onConfirm'>)}
	<ConfirmDialog bind:open {...args} onConfirm={() => (confirmed = true)}>
		{#snippet trigger(props)}
			<Button {...props} variant="destructive">Delete asset</Button>
		{/snippet}

		<p class="text-sm text-muted-foreground">
			The file will be removed from the workspace and any shared links will stop working.
		</p>
	</ConfirmDialog>

	<p class="mt-4 text-xs text-muted-foreground">
		{confirmed ? 'Confirmed' : 'Not confirmed'}
	</p>
{/snippet}

<Story name="Default" {template} />
