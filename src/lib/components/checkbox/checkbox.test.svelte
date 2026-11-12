<script lang="ts">
	import Checkbox from './checkbox.svelte';

	let checked = $state(false);
</script>

<Checkbox bind:checked label="Accept terms" />
<span data-testid="checked">{checked}</span>
