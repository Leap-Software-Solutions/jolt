<script lang="ts">
	import ChatActions from './chat-actions.svelte';

	let regenerated = $state(false);
	let copied = $state('');
	let copyFailed = $state(false);
	let feedback = $state<'up' | 'down' | null>(null);
</script>

<ChatActions
	content="A response"
	bind:feedback
	onCopy={(content) => (copied = content)}
	onCopyError={() => (copyFailed = true)}
	onRegenerate={() => (regenerated = true)}
	onFeedback={() => {}}
/>
<span data-testid="regenerated">{regenerated ? 'yes' : 'no'}</span>
<span data-testid="copied">{copied}</span>
<span data-testid="copy-failed">{copyFailed ? 'yes' : 'no'}</span>
