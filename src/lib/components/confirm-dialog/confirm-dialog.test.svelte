<script lang="ts">
	import ConfirmDialog from './confirm-dialog.svelte';

	let open = $state(false);
	let confirmed = $state(false);
</script>

<button type="button" onclick={() => (open = true)}>Open confirmation</button>

<ConfirmDialog
	bind:open
	title="Delete asset"
	description="This action cannot be undone."
	confirmLabel="Delete"
	variant="destructive"
	onConfirm={() => (confirmed = true)}
/>

<span data-testid="confirmed">{confirmed}</span>
