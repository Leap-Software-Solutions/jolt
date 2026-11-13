<script lang="ts">
	import Chat from './chat.svelte';
	import type { ChatMessageData } from './types.js';

	const messages: ChatMessageData[] = [
		{ id: '1', role: 'user', content: 'Hello', name: 'Ada' },
		{ id: '2', role: 'assistant', content: 'Welcome message', name: 'Jolt' },
	];
	let sent = $state('');
	let value = $state('');
</script>

<div style="height: 30rem; width: 40rem;">
	<Chat
		{messages}
		bind:value
		onSend={(text) => {
			sent = text;
			value = '';
		}}
	/>
</div>
<span data-testid="sent">{sent}</span>
