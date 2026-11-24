<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from '../avatar/avatar.svelte';
	import HoverCard, { type Props as HoverCardProps } from './hover-card.svelte';

	const { Story } = defineMeta({
		title: 'Overlays/Hover Card',
		component: HoverCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			openDelay: 200,
		},
	});
</script>

{#snippet template(args: Omit<HoverCardProps, 'trigger' | 'children'>)}
	<HoverCard {...args}>
		{#snippet trigger(props)}
			<a
				{...props}
				href="#ada"
				class="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-brand"
			>
				Ada Lovelace
			</a>
		{/snippet}
		<div class="flex gap-3">
			<Avatar alt="Ada Lovelace" size="lg" />
			<div class="grid gap-1">
				<p class="font-medium">Ada Lovelace</p>
				<p class="text-sm text-muted-foreground">Engineering</p>
				<p class="pt-1 text-xs text-muted-foreground">Joined the team in 1843.</p>
			</div>
		</div>
	</HoverCard>
{/snippet}

<Story name="Default" {template} />
