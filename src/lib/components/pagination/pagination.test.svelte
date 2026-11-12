<script lang="ts">
	import Pagination from './pagination.svelte';

	let page = $state(1);
</script>

<Pagination count={100} perPage={10} bind:page />
<span data-testid="page">{page}</span>
