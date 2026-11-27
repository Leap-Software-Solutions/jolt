<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Avatar } from '../avatar/index.js';
	import { TimeAgo } from '../time-ago/index.js';
	import type { Props, TimelineEvent, TimelineTone } from './types.js';

	let { groups, ariaLabel = 'Timeline', marker, class: className }: Props = $props();

	const timelineId = $props.id();
	const toneClasses: Record<TimelineTone, string> = {
		neutral: 'border-border text-muted-foreground',
		info: 'border-info/40 text-info',
		success: 'border-success/40 text-success',
		warning: 'border-warning/40 text-warning',
		danger: 'border-destructive/40 text-destructive',
	};
	const interactiveClass =
		'group -mx-2 flex w-full gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden';
	const staticClass = '-mx-2 flex w-full gap-3 rounded-lg px-2 py-1';

	function getMarkerClass(event: TimelineEvent): string {
		if (event.actor) {
			return 'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-background';
		}

		const tone = event.tone ?? 'neutral';
		return cls(
			'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background',
			toneClasses[tone],
		);
	}
</script>

{#snippet eventContent(event: TimelineEvent)}
	<span
		data-slot="timeline-marker"
		data-tone={event.tone ?? 'neutral'}
		class={getMarkerClass(event)}
	>
		{#if marker}
			{@render marker(event)}
		{:else if event.actor}
			<Avatar
				alt={event.actor.name}
				src={event.actor.avatarSrc}
				initials={event.actor.initials}
				size="sm"
			/>
		{:else}
			<span aria-hidden="true" class="size-2 rounded-full bg-current"></span>
		{/if}
	</span>

	<span class="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-3 gap-y-0.5 pt-1.5">
		<span class="min-w-0 flex-1">
			<span data-slot="timeline-event-title" class="block text-sm font-medium">{event.title}</span>
			{#if event.description}
				<span class="mt-0.5 block text-sm text-muted-foreground">{event.description}</span>
			{/if}
		</span>
		{#if event.timestamp}
			<TimeAgo date={event.timestamp} class="mt-0.5 text-xs text-muted-foreground" />
		{/if}
	</span>
{/snippet}

<section data-slot="timeline" aria-label={ariaLabel} class={cls('flex flex-col gap-6', className)}>
	{#each groups as group, groupIndex (group.id)}
		<section
			data-slot="timeline-group"
			aria-labelledby={group.label ? `${timelineId}-group-${groupIndex}` : undefined}
			class="flex flex-col gap-2.5"
		>
			{#if group.label}
				<h3
					id={`${timelineId}-group-${groupIndex}`}
					data-slot="timeline-group-label"
					class="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
				>
					{group.label}
				</h3>
			{/if}

			<ol class="flex flex-col">
				{#each group.events as event, eventIndex (event.id)}
					<li
						data-slot="timeline-event"
						class={cls('relative', eventIndex < group.events.length - 1 && 'pb-5')}
					>
						{#if eventIndex < group.events.length - 1}
							<span
								aria-hidden="true"
								data-slot="timeline-connector"
								class="pointer-events-none absolute top-9 -bottom-1 left-4 z-0 w-px bg-border"
							></span>
						{/if}

						{#if event.href}
							<a href={event.href} class={interactiveClass}>
								{@render eventContent(event)}
							</a>
						{:else if event.onActivate}
							<button
								type="button"
								class={interactiveClass}
								onclick={() => event.onActivate?.(event)}
							>
								{@render eventContent(event)}
							</button>
						{:else}
							<div class={staticClass}>
								{@render eventContent(event)}
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</section>
