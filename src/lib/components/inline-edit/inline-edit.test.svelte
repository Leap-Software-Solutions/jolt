<script lang="ts">
	import InlineEdit from './inline-edit.svelte';

	let { multiline = false, disabled = false }: { multiline?: boolean; disabled?: boolean } =
		$props();

	let value = $state('Move the release checklist');
	let editing = $state(false);
	let changes = $state<string[]>([]);
</script>

<div>
	<InlineEdit
		bind:value
		bind:editing
		placeholder="Add a card"
		ariaLabel="Card text"
		{multiline}
		{disabled}
		onValueChange={(next) => (changes = [...changes, next])}
	/>
	<button data-testid="external-edit" onclick={() => (editing = true)}>External edit</button>
	<button data-testid="outside" onclick={() => {}}>Outside</button>
	<span data-testid="value">{value}</span>
	<span data-testid="changes">{changes.join('|')}</span>
	<span data-testid="editing">{editing ? 'yes' : 'no'}</span>
</div>
