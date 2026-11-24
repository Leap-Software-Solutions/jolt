<script lang="ts">
	import type { AvatarStatus } from './avatar.svelte';
	import Avatar from './avatar.svelte';

	let {
		status,
		statusLabel,
	}: {
		status?: AvatarStatus;
		statusLabel?: string;
	} = $props();
</script>

<Avatar alt="Ada Lovelace" initials="AL" {status} {statusLabel} />
