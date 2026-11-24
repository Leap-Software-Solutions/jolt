<script lang="ts">
	import CopyButton from './copy-button.svelte';

	let { label }: { label?: string } = $props();
	let copied = $state('');
	let failed = $state(false);
</script>

<CopyButton
	value="https://leap.online/invite/retro-42"
	copyLabel="Copy invite link"
	{label}
	onCopy={(value) => (copied = value)}
	onError={() => (failed = true)}
/>
<span data-testid="copied">{copied}</span>
<span data-testid="failed">{failed ? 'failed' : ''}</span>
