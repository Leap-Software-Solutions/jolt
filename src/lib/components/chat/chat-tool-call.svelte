<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type ChatToolStatus = 'pending' | 'running' | 'success' | 'error';

	export type Props = {
		name: string;
		status?: ChatToolStatus;
		summary?: string;
		open?: boolean;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import {
		CheckCircle2Icon,
		ChevronDownIcon,
		CircleIcon,
		LoaderCircleIcon,
		WrenchIcon,
		XCircleIcon,
	} from '@lucide/svelte';
	import { Collapsible as BitsCollapsible } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		name,
		status = 'success',
		summary,
		open = $bindable(false),
		children,
		class: className,
	}: Props = $props();

	const statusLabels = {
		pending: 'Pending',
		running: 'Running',
		success: 'Complete',
		error: 'Failed',
	};

	const statusLabel = $derived(statusLabels[status]);
</script>

<BitsCollapsible.Root
	bind:open
	data-slot="chat-tool-call"
	class={cls('w-full overflow-hidden rounded-lg border bg-card', className)}
>
	<BitsCollapsible.Trigger
		class="group flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
	>
		<WrenchIcon class="size-4 shrink-0 text-muted-foreground" />
		<span class="font-medium">{name}</span>
		{#if summary}
			<span class="min-w-0 truncate text-muted-foreground">{summary}</span>
		{/if}
		<span class="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
			{#if status === 'running'}
				<LoaderCircleIcon class="size-3.5 animate-spin" />
			{:else if status === 'success'}
				<CheckCircle2Icon class="size-3.5" />
			{:else if status === 'error'}
				<XCircleIcon class="size-3.5" />
			{:else}
				<CircleIcon class="size-3.5" />
			{/if}
			<span>{statusLabel}</span>
		</span>
		<ChevronDownIcon
			class="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
		/>
	</BitsCollapsible.Trigger>

	<BitsCollapsible.Content
		class="overflow-hidden border-t data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
	>
		<div class="p-3 text-sm">
			{@render children?.()}
		</div>
	</BitsCollapsible.Content>
</BitsCollapsible.Root>
