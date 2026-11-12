<script lang="ts">
	import NavigationMenu from './navigation-menu.svelte';
</script>

{#snippet content()}
	<a href="#intro">Introduction</a>
	<a href="#install">Installation</a>
{/snippet}

<NavigationMenu
	items={[
		{ value: 'guides', label: 'Guides', content },
		{ value: 'docs', label: 'Docs', href: '#docs' },
	]}
	ariaLabel="Example navigation"
	delayDuration={0}
/>
