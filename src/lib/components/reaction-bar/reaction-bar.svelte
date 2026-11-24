<script lang="ts" module>
	export type Reaction = {
		key: string;
		emoji: string;
		label: string;
		count: number;
		active?: boolean;
	};

	export type Props = {
		reactions?: Reaction[];
		ariaLabel?: string;
		disabled?: boolean;
		class?: string;
		itemClass?: string;
		onReactionsChange?: (reactions: Reaction[]) => void;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';

	let {
		reactions = $bindable([]),
		ariaLabel = 'Reactions',
		disabled = false,
		class: className,
		itemClass,
		onReactionsChange,
	}: Props = $props();

	const itemClasses = $derived(
		cls(
			'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap select-none transition-colors duration-150 ease-out motion-reduce:transition-none',
			'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
			'aria-pressed:border-brand/40 aria-pressed:bg-brand/10 aria-pressed:text-brand-strong aria-pressed:hover:bg-brand/15',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
			'disabled:pointer-events-none disabled:opacity-50',
			itemClass,
		),
	);

	function getCountLabel(count: number): string {
		if (count === 0) return 'no reactions';
		return `${count} ${count === 1 ? 'reaction' : 'reactions'}`;
	}

	function getReactionLabel(reaction: Reaction): string {
		const selected = reaction.active ? ', selected' : '';
		return `${reaction.label}, ${getCountLabel(reaction.count)}${selected}`;
	}

	function toggleReaction(key: string): void {
		const next = reactions.map((reaction) => {
			if (reaction.key !== key) return reaction;

			const active = !reaction.active;
			return {
				...reaction,
				active,
				count: Math.max(0, reaction.count + (active ? 1 : -1)),
			};
		});

		reactions = next;
		onReactionsChange?.(next);
	}
</script>

{#if reactions.length}
	<div
		role="group"
		aria-label={ariaLabel}
		data-slot="reaction-bar"
		class={cls('flex flex-wrap items-center gap-1', className)}
	>
		{#each reactions as reaction (reaction.key)}
			<button
				type="button"
				data-slot="reaction"
				class={itemClasses}
				aria-label={getReactionLabel(reaction)}
				aria-pressed={reaction.active ?? false}
				title={reaction.label}
				{disabled}
				onclick={() => toggleReaction(reaction.key)}
			>
				<span aria-hidden="true" data-slot="reaction-emoji" class="text-sm leading-none">
					{reaction.emoji}
				</span>
				{#if reaction.count > 0}
					<span aria-hidden="true" data-slot="reaction-count" class="tabular-nums">
						{reaction.count}
					</span>
				{/if}
			</button>
		{/each}
	</div>
{/if}
