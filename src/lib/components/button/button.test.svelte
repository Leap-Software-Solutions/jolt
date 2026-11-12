<script lang="ts">
	import Button from './button.svelte';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<Button {onclick}>Click me</Button>
