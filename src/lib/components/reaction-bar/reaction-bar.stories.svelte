<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as ReactionBarProps, Reaction } from './reaction-bar.svelte';
	import ReactionBar from './reaction-bar.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Reaction Bar',
		component: ReactionBar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			ariaLabel: 'Retro card reactions',
			onReactionsChange: () => {},
		},
	});
</script>

<script lang="ts">
	const initialReactions: Reaction[] = [
		{ key: 'agree', emoji: '👍', label: 'Agree', count: 4, active: true },
		{ key: 'question', emoji: '❓', label: 'Question', count: 2 },
		{ key: 'celebrate', emoji: '🎉', label: 'Celebrate', count: 0 },
	];

	let reactions = $state<Reaction[]>(initialReactions.map((reaction) => ({ ...reaction })));
	let singleReaction = $state<Reaction[]>([
		{ key: 'agree', emoji: '👍', label: 'Agree', count: 1 },
	]);
	let lastChange = $state('');

	type TemplateArgs = Omit<ReactionBarProps, 'reactions' | 'onReactionsChange'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="space-y-3">
		<ReactionBar
			bind:reactions
			{...args}
			onReactionsChange={(next) =>
				(lastChange = next.map((reaction) => `${reaction.key}:${reaction.count}`).join(', '))}
		/>
		<p class="text-xs text-muted-foreground">Last change: {lastChange || '(none)'}</p>
	</div>
{/snippet}

{#snippet singleTemplate(args: TemplateArgs)}
	<div class="space-y-3">
		<ReactionBar
			bind:reactions={singleReaction}
			{...args}
			onReactionsChange={(next) =>
				(lastChange = next.map((reaction) => `${reaction.key}:${reaction.count}`).join(', '))}
		/>
		<p class="text-xs text-muted-foreground">Last change: {lastChange || '(none)'}</p>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Disabled" args={{ disabled: true }} {template} />

<Story name="Single reaction" template={singleTemplate} />
