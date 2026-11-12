<script lang="ts" module>
	import type { Component } from 'svelte';

	export type BreadcrumbItem = {
		label: string;
		href?: string;
		icon?: Component<{ class?: string }>;
		current?: boolean;
	};

	export type Props = {
		items: BreadcrumbItem[];
		maxItems?: number;
		overflowLabel?: string;
		separator?: string;
		ariaLabel?: string;
		class?: string;
		itemClass?: string;
		linkClass?: string;
		currentClass?: string;
		separatorClass?: string;
	};
</script>

<script lang="ts">
	import { MoreHorizontalIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Button } from '../button/index.js';
	import { Popover } from '../popover/index.js';

	type BreadcrumbEntry =
		| { type: 'item'; item: BreadcrumbItem; index: number }
		| { type: 'overflow'; items: BreadcrumbItem[] };

	let {
		items,
		maxItems = 5,
		overflowLabel = 'Show hidden breadcrumbs',
		separator = '/',
		ariaLabel = 'Breadcrumb',
		class: className,
		itemClass,
		linkClass,
		currentClass,
		separatorClass,
	}: Props = $props();

	let overflowOpen = $state(false);

	const visibleEntries = $derived.by<BreadcrumbEntry[]>(() => {
		const limit = Math.max(3, maxItems);

		if (items.length <= limit) {
			return items.map((item, index) => ({ type: 'item', item, index }));
		}

		const tailCount = limit - 2;
		const tail = items.slice(-tailCount).map((item, offset) => ({
			type: 'item' as const,
			item,
			index: items.length - tailCount + offset,
		}));

		return [
			{ type: 'item', item: items[0], index: 0 },
			{ type: 'overflow', items: items.slice(1, items.length - tailCount) },
			...tail,
		];
	});

	function isCurrent(item: BreadcrumbItem, index: number): boolean {
		return item.current ?? index === items.length - 1;
	}
</script>

{#snippet itemIcon(item: BreadcrumbItem)}
	{#if item.icon}
		{@const Icon = item.icon}
		<Icon class="size-4" />
	{/if}
{/snippet}

<nav aria-label={ariaLabel} data-slot="breadcrumb" class={className}>
	<ol class="flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground">
		{#each visibleEntries as entry, entryIndex (entryIndex)}
			{#if entry.type === 'overflow'}
				<li data-slot="breadcrumb-overflow" class={cls('inline-flex items-center', itemClass)}>
					<Popover bind:open={overflowOpen} contentClass="w-48 p-1">
						{#snippet trigger(props)}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="size-7"
								aria-label={overflowLabel}
							>
								<MoreHorizontalIcon class="size-4" />
							</Button>
						{/snippet}
						<div class="grid gap-0.5">
							{#each entry.items as item, hiddenIndex (hiddenIndex)}
								{#if item.href}
									<a
										href={item.href}
										data-slot="breadcrumb-overflow-item"
										class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
										onclick={() => (overflowOpen = false)}
									>
										{@render itemIcon(item)}
										{item.label}
									</a>
								{:else}
									<span
										data-slot="breadcrumb-overflow-item"
										class="flex items-center gap-2 px-2 py-1.5 text-sm"
									>
										{@render itemIcon(item)}
										{item.label}
									</span>
								{/if}
							{/each}
						</div>
					</Popover>
				</li>
			{:else}
				{@const current = isCurrent(entry.item, entry.index)}
				<li data-slot="breadcrumb-item" class={cls('inline-flex items-center gap-1.5', itemClass)}>
					{#if current}
						<span
							aria-current="page"
							class={cls(
								'inline-flex items-center gap-1.5 font-medium text-foreground',
								currentClass,
							)}
						>
							{@render itemIcon(entry.item)}
							{entry.item.label}
						</span>
					{:else if entry.item.href}
						<a
							href={entry.item.href}
							class={cls(
								'inline-flex items-center gap-1.5 transition-colors hover:text-foreground',
								linkClass,
							)}
						>
							{@render itemIcon(entry.item)}
							{entry.item.label}
						</a>
					{:else}
						<span class="inline-flex items-center gap-1.5">
							{@render itemIcon(entry.item)}
							{entry.item.label}
						</span>
					{/if}
				</li>
			{/if}
			{#if entryIndex < visibleEntries.length - 1}
				<li aria-hidden="true" class={cls('text-muted-foreground/60', separatorClass)}>
					{separator}
				</li>
			{/if}
		{/each}
	</ol>
</nav>
