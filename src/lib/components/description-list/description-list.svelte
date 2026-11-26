<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type DescriptionListItem = {
		/** Stable key for the row. Falls back to the array index. */
		id?: string;
		label: string;
		value: string;
		/** Show a copy control for the value. */
		copyable?: boolean;
		/** Value copied by the control. Defaults to `value`. */
		copyValue?: string;
	};

	export type DescriptionListLayout = 'horizontal' | 'stacked';

	export type Props = {
		items: DescriptionListItem[];
		/** Label/value arrangement. Horizontal falls back to stacked on narrow screens. */
		layout?: DescriptionListLayout;
		loading?: boolean;
		/** Number of skeleton rows while loading. Defaults to the item count, with a minimum of three. */
		skeletonRows?: number;
		/** Custom value renderer. Copy controls still use `copyValue` or `value`. */
		value?: Snippet<[DescriptionListItem]>;
		class?: string;
		rowClass?: string;
		labelClass?: string;
		valueClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { CopyButton } from '../copy-button/index.js';
	import { Skeleton } from '../skeleton/index.js';

	let {
		items,
		layout = 'horizontal',
		loading = false,
		skeletonRows,
		value: valueSnippet,
		class: className,
		rowClass,
		labelClass,
		valueClass,
	}: Props = $props();

	const rowCount = $derived(skeletonRows ?? Math.max(items.length, 3));
	const skeletonRowIndexes = $derived([...Array(rowCount).keys()]);
	const layoutClass = $derived(
		layout === 'horizontal'
			? 'grid grid-cols-1 gap-1 sm:grid-cols-[minmax(7rem,0.35fr)_1fr] sm:gap-x-4'
			: 'grid grid-cols-1 gap-1',
	);
</script>

<dl
	data-slot="description-list"
	data-layout={layout}
	aria-busy={loading || undefined}
	class={cls('w-full text-sm', className)}
>
	{#if loading}
		{#each skeletonRowIndexes as index (index)}
			<div
				data-slot="description-list-row"
				class={cls('border-b py-2.5 last:border-b-0', layoutClass, rowClass)}
			>
				<Skeleton class="h-5 w-24" />
				<Skeleton class="h-5 w-40" />
			</div>
		{/each}
	{:else}
		{#each items as item, index (item.id ?? index)}
			<div
				data-slot="description-list-row"
				class={cls('group grid gap-1 border-b py-2.5 last:border-b-0', layoutClass, rowClass)}
			>
				<dt data-slot="description-list-label" class={cls('text-muted-foreground', labelClass)}>
					{item.label}
				</dt>
				<dd
					data-slot="description-list-value"
					class={cls('flex min-w-0 items-center gap-1.5', valueClass)}
				>
					<span class="min-w-0 break-words">
						{#if valueSnippet}
							{@render valueSnippet(item)}
						{:else}
							{item.value}
						{/if}
					</span>
					{#if item.copyable}
						<CopyButton
							value={item.copyValue ?? item.value}
							copyLabel={`Copy ${item.label}`}
							variant="ghost"
							size="icon"
							class="-my-0.5 size-6 shrink-0 text-muted-foreground"
						/>
					{/if}
				</dd>
			</div>
		{/each}
	{/if}
</dl>
