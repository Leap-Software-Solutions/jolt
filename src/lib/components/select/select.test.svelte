<script lang="ts">
	import Select from './select.svelte';
	import type { SelectItem } from './types.js';

	const items: SelectItem<string>[] = [
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'archived', label: 'Archived' },
	];

	let { value = $bindable('active') }: { value?: string } = $props();
</script>

<Select {items} bind:value ariaLabel="Status" />
<span data-testid="value">{value}</span>
