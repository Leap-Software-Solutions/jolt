<script lang="ts">
	import Slider from './slider.svelte';

	let value = $state(20);
</script>

<Slider bind:value label="Volume" />
<span data-testid="value">{value}</span>
