<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { avatarAlt, avatarSrc } from '../../../docs/fixtures/avatar.js';
	import type { Props as CardProps } from './card.svelte';
	import Card from './card.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Card',
		component: Card,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			title: 'Design system',
			description: 'Shared foundations for every Leap application.',
		},
	});

	type TemplateArgs = Omit<CardProps, 'children' | 'footer' | 'header'>;
	type HeaderArgs = Omit<CardProps, 'children' | 'footer' | 'header'>;
</script>

<script lang="ts">
	import { Avatar } from '../avatar/index.js';
	import { Button } from '../button/index.js';
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-80">
		<Card {...args}>
			<p class="text-sm text-muted-foreground">
				Jolt keeps behaviour, accessibility, and visual language in one place.
			</p>
			{#snippet footer()}
				<div class="flex w-full items-center justify-between">
					<span class="text-xs text-muted-foreground">Updated today</span>
					<Button size="sm" variant="outline">Open</Button>
				</div>
			{/snippet}
		</Card>
	</div>
{/snippet}

{#snippet customHeaderTemplate(args: HeaderArgs)}
	<div class="w-80">
		<Card {...args}>
			{#snippet header()}
				<div class="flex items-center gap-3">
					<Avatar src={avatarSrc} alt={avatarAlt} />
					<div class="flex flex-col gap-0.5">
						<span class="text-sm font-medium">Ada Lovelace</span>
						<span class="text-xs text-muted-foreground">Engineering</span>
					</div>
				</div>
			{/snippet}
			<p class="text-sm text-muted-foreground">
				Custom headers can hold an avatar, metadata, or actions.
			</p>
		</Card>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story
	name="Custom header"
	args={{ title: undefined, description: undefined }}
	template={customHeaderTemplate}
/>

<Story name="Body only" args={{ title: undefined, description: undefined }} {template} />
