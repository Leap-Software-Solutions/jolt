<script lang="ts">
	import Textarea from './textarea.svelte';

	let value = $state('');
</script>

<Textarea aria-label="Notes" bind:value />
<span data-testid="value">{value}</span>
