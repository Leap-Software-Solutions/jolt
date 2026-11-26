<script lang="ts">
	import FeedItem from './feed-item.svelte';

	let { href, onActivate }: { href?: string; onActivate?: () => void } = $props();
	let activations = $state(0);
	let trailingClicks = $state(0);

	function activate(): void {
		activations += 1;
		onActivate?.();
	}
</script>

<FeedItem
	title="Deployment completed"
	meta="Production · 3 minutes ago"
	unread
	{href}
	onActivate={href ? undefined : activate}
>
	{#snippet trailing()}
		<button data-testid="trailing" type="button" onclick={() => (trailingClicks += 1)}>
			Review
		</button>
	{/snippet}
</FeedItem>
<span data-testid="activations">{activations}</span>
<span data-testid="trailing-clicks">{trailingClicks}</span>
