<script lang="ts">
	import AvatarGroup from './avatar-group.svelte';

	const items = [
		{ alt: 'Ada Lovelace', initials: 'AL' },
		{ alt: 'Grace Hopper', initials: 'GH' },
		{ alt: 'Katherine Johnson', initials: 'KJ' },
		{ alt: 'Margaret Hamilton', initials: 'MH' },
	];
</script>

<AvatarGroup {items} max={2} />
