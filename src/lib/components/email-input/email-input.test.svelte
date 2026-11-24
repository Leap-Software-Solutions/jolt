<script lang="ts">
	import EmailInput from './email-input.svelte';

	let { value = $bindable([]) }: { value?: string[] } = $props();
	let rejected = $state('');
</script>

<EmailInput
	bind:value
	ariaLabel="Invite emails"
	onInvalid={(tag, reason) => (rejected = `${tag}:${reason}`)}
/>
<span data-testid="value">{value.join('|')}</span>
<span data-testid="rejected">{rejected}</span>
