<script lang="ts">
	import SelectField from './select-field.svelte';

	const items = [
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
	];

	let value = $state('active');
</script>

<SelectField
	label="Status"
	{items}
	bind:value
	error={value === 'draft' ? 'Draft needs review.' : undefined}
/>
<span data-testid="value">{value}</span>
