<script lang="ts">
	import ChatActions from './chat-actions.svelte';

	let regenerated = $state(false);
	let feedback = $state<'up' | 'down' | null>(null);
</script>

<ChatActions
	content="A response"
	bind:feedback
	onRegenerate={() => (regenerated = true)}
	onFeedback={() => {}}
/>
<span data-testid="regenerated">{regenerated ? 'yes' : 'no'}</span>
