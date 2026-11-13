<script lang="ts">
	import ChatComposer from './chat-composer.svelte';

	let value = $state('');
	let sent = $state('');
	let dropped = $state('');

	function handleSend(next: string): void {
		sent = next;
		value = '';
	}

	function handleFiles(files: File[]): void {
		dropped = files.map((file) => file.name).join(',');
	}
</script>

<ChatComposer bind:value onSend={handleSend} onFiles={handleFiles} />
<span data-testid="sent">{sent}</span>
<span data-testid="dropped">{dropped}</span>
