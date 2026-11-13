<script lang="ts" module>
	export type Props = {
		content: string;
		class?: string;
	};
</script>

<script lang="ts">
	import Markdown from '../markdown/markdown.svelte';

	let { content, class: className }: Props = $props();
</script>

<div data-slot="chat-markdown">
	<Markdown {content} class={className} />
</div>
