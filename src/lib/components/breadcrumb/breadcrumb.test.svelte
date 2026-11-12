<script lang="ts">
	import Breadcrumb from './breadcrumb.svelte';

	const items = [
		{ label: 'Home', href: '/home' },
		{ label: 'Engineering', href: '/engineering' },
		{ label: 'Design systems', href: '/design-systems' },
		{ label: 'Jolt', href: '/jolt' },
		{ label: 'Documentation', href: '/docs' },
		{ label: 'Components', current: true },
	];
</script>

<Breadcrumb {items} maxItems={5} />
