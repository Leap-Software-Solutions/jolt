<script lang="ts">
	import TagsInput from './tags-input.svelte';
	import type { Props } from './types.js';

	let { value = $bindable([]), ...rest }: Props = $props();
	let rejected = $state('');
</script>

<TagsInput bind:value {...rest} onInvalid={(tag, reason) => (rejected = `${tag}:${reason}`)} />
<span data-testid="value">{value.join('|')}</span>
<span data-testid="rejected">{rejected}</span>
