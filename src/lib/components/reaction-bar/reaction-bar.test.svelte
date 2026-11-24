<script lang="ts">
	import ReactionBar, { type Reaction } from './reaction-bar.svelte';

	let { disabled = false }: { disabled?: boolean } = $props();

	let reactions = $state<Reaction[]>([
		{ key: 'agree', emoji: '👍', label: 'Agree', count: 2 },
		{ key: 'question', emoji: '❓', label: 'Question', count: 1, active: true },
		{ key: 'celebrate', emoji: '🎉', label: 'Celebrate', count: 0 },
	]);
	let changes = $state('');
</script>

<ReactionBar
	bind:reactions
	ariaLabel="Retro card reactions"
	{disabled}
	onReactionsChange={(next) =>
		(changes = next
			.map((reaction) => `${reaction.key}:${reaction.count}:${reaction.active}`)
			.join('|'))}
/>
<span data-testid="changes">{changes}</span>
<span data-testid="state"
	>{reactions
		.map((reaction) => `${reaction.key}:${reaction.count}:${reaction.active}`)
		.join('|')}</span
>
