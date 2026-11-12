<script lang="ts" module>
	import { UsersRoundIcon } from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../button/button.svelte';
	import EmptyState, { type Props as EmptyStateProps } from './empty-state.svelte';

	const { Story } = defineMeta({
		title: 'Patterns/EmptyState',
		component: EmptyState,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'No engineers yet',
			description: 'Invite someone to the workspace to start assigning work.',
			icon: UsersRoundIcon,
		},
	});
</script>

{#snippet template(args: Omit<EmptyStateProps, 'action'>)}
	<div class="w-96 rounded-xl border bg-card">
		<EmptyState {...args}>
			{#snippet action()}
				<Button variant="outline">Invite engineer</Button>
			{/snippet}
		</EmptyState>
	</div>
{/snippet}

<Story name="Default" {template} />
