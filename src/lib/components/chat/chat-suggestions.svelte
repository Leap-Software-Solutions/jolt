<script lang="ts" module>
	export type Props = {
		suggestions: string[];
		title?: string;
		ariaLabel?: string;
		onSelect?: (suggestion: string) => void;
		class?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';

	let {
		suggestions,
		title = 'Try asking',
		ariaLabel = 'Suggested prompts',
		onSelect,
		class: className,
	}: Props = $props();
</script>

<section
	aria-label={ariaLabel}
	data-slot="chat-suggestions"
	class={cls('flex flex-col gap-2', className)}
>
	{#if title}
		<p class="text-xs font-medium text-muted-foreground">{title}</p>
	{/if}

	<div class="flex flex-wrap gap-2">
		{#each suggestions as suggestion (suggestion)}
			<Button
				variant="outline"
				class="h-auto min-h-10 justify-start px-4 py-2.5 text-left text-sm whitespace-normal"
				onclick={() => onSelect?.(suggestion)}
			>
				{suggestion}
			</Button>
		{/each}
	</div>
</section>
