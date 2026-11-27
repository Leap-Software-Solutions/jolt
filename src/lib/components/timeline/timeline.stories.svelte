<script lang="ts" module>
	import {
		CheckIcon,
		CircleIcon,
		MessageSquareIcon,
		TriangleAlertIcon,
		XIcon,
	} from '@lucide/svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Avatar } from '../avatar/index.js';
	import Timeline from './timeline.svelte';
	import type { Props as TimelineProps, TimelineEvent, TimelineGroup } from './types.js';

	const now = Date.now();

	const activityGroups: TimelineGroup[] = [
		{
			id: 'today',
			label: 'Today',
			events: [
				{
					id: 'deploy',
					title: 'Deployment completed',
					description: 'Production is serving the new build.',
					timestamp: now - 5 * 60 * 1_000,
					actor: { name: 'Ada Lovelace', initials: 'AL' },
					tone: 'success',
				},
				{
					id: 'review',
					title: 'Review requested',
					description: 'The release checklist needs one more approval.',
					timestamp: now - 32 * 60 * 1_000,
					actor: { name: 'Grace Hopper', initials: 'GH' },
					tone: 'info',
				},
				{
					id: 'comment',
					title: 'Comment added',
					description: '“The migration plan looks good.”',
					timestamp: now - 2 * 60 * 60 * 1_000,
					tone: 'neutral',
				},
			],
		},
		{
			id: 'yesterday',
			label: 'Yesterday',
			events: [
				{
					id: 'incident',
					title: 'Incident resolved',
					description: 'Errors returned to the baseline after the rollback.',
					timestamp: now - 26 * 60 * 60 * 1_000,
					tone: 'success',
				},
				{
					id: 'access',
					title: 'Workspace access updated',
					timestamp: now - 29 * 60 * 60 * 1_000,
					tone: 'warning',
				},
				{
					id: 'build',
					title: 'Build failed on main',
					description: 'The scheduled run stopped at the typecheck step.',
					timestamp: now - 31 * 60 * 60 * 1_000,
					tone: 'danger',
				},
			],
		},
		{
			id: 'earlier',
			label: 'Earlier this week',
			events: [
				{
					id: 'migration',
					title: 'Database migration completed',
					description: 'The new index is available without downtime.',
					timestamp: now - 3 * 24 * 60 * 60 * 1_000,
					actor: { name: 'Katherine Johnson', initials: 'KJ' },
					tone: 'success',
				},
				{
					id: 'retro',
					title: 'Retrospective published',
					timestamp: now - 5 * 24 * 60 * 60 * 1_000,
					tone: 'info',
				},
			],
		},
	];

	const linkedGroups: TimelineGroup[] = activityGroups.map((group) => ({
		...group,
		events: group.events.map((event) => ({ ...event, href: `/activity/${event.id}` })),
	}));

	const ungroupedGroups: TimelineGroup[] = [
		{
			id: 'activity',
			events: activityGroups.flatMap((group) => group.events),
		},
	];

	const { Story } = defineMeta({
		title: 'Data Display/Timeline',
		component: Timeline,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			groups: activityGroups,
			ariaLabel: 'Recent activity',
		},
	});
</script>

<script lang="ts">
	let selected = $state('None');

	const actionableGroups = $derived.by((): TimelineGroup[] => {
		return activityGroups.map((group) => ({
			...group,
			events: group.events.map((event) => ({
				...event,
				onActivate: (item: TimelineEvent) => {
					selected = item.title;
				},
			})),
		}));
	});
</script>

{#snippet featureTemplate(args: TimelineProps)}
	<div class="w-[32rem] rounded-lg border bg-card p-4">
		<Timeline {...args}>
			{#snippet marker(event: TimelineEvent)}
				{#if event.actor}
					<Avatar
						alt={event.actor.name}
						src={event.actor.avatarSrc}
						initials={event.actor.initials}
						size="sm"
					/>
				{:else if event.tone === 'success'}
					<CheckIcon aria-hidden="true" class="size-3.5" />
				{:else if event.tone === 'info'}
					<MessageSquareIcon aria-hidden="true" class="size-3.5" />
				{:else if event.tone === 'warning'}
					<TriangleAlertIcon aria-hidden="true" class="size-3.5" />
				{:else if event.tone === 'danger'}
					<XIcon aria-hidden="true" class="size-3.5" />
				{:else}
					<CircleIcon aria-hidden="true" class="size-3.5" />
				{/if}
			{/snippet}
		</Timeline>
	</div>
{/snippet}

{#snippet plainTemplate(args: TimelineProps)}
	<div class="w-[32rem] rounded-lg border bg-card p-4">
		<Timeline {...args} />
	</div>
{/snippet}

{#snippet actionableTemplate(args: TimelineProps)}
	<div class="w-[32rem] rounded-lg border bg-card p-4">
		<Timeline {...args} groups={actionableGroups} />
		<p class="mt-3 text-xs text-muted-foreground" aria-live="polite">Selected: {selected}</p>
	</div>
{/snippet}

<Story name="Default" template={featureTemplate} />

<Story name="Linked" args={{ groups: linkedGroups }} template={plainTemplate} />

<Story name="Actionable" template={actionableTemplate} />

<Story name="Without group labels" args={{ groups: ungroupedGroups }} template={featureTemplate} />
