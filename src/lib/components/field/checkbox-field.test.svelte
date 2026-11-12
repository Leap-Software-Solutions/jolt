<script lang="ts">
	import CheckboxField from './checkbox-field.svelte';

	let checked = $state(false);
</script>

<CheckboxField
	label="Accept terms"
	bind:checked
	error={checked ? undefined : 'Accept the terms before continuing.'}
/>
<span data-testid="checked">{checked}</span>
