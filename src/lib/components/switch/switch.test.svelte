<script lang="ts">
	import Switch from './switch.svelte';

	let checked = $state(false);
</script>

<Switch bind:checked label="Enable notifications" />
<span data-testid="checked">{checked}</span>
