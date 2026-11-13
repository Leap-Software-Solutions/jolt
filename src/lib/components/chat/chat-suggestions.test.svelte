<script lang="ts">
	import ChatSuggestions from './chat-suggestions.svelte';

	let selected = $state('');
</script>

<ChatSuggestions
	suggestions={['Summarise the latest release']}
	onSelect={(value) => (selected = value)}
/>
<span data-testid="selected">{selected}</span>
