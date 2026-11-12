<script lang="ts">
	import TextField from './text-field.svelte';

	let value = $state('');
</script>

<TextField
	label="Email"
	bind:value
	error={value === 'bad' ? 'Enter a valid email address.' : undefined}
/>
<span data-testid="value">{value}</span>
