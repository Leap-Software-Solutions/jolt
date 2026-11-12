<script lang="ts" module>
	export type PaginationOrientation = 'horizontal' | 'vertical';

	export type Props = {
		count: number;
		perPage?: number;
		page?: number;
		onPageChange?: (page: number) => void;
		siblingCount?: number;
		loop?: boolean;
		orientation?: PaginationOrientation;
		ariaLabel?: string;
		prevLabel?: string;
		nextLabel?: string;
		class?: string;
		buttonClass?: string;
		activeClass?: string;
		ellipsisClass?: string;
	};
</script>

<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Pagination as BitsPagination } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		count,
		perPage = 10,
		page = $bindable(1),
		onPageChange,
		siblingCount = 1,
		loop,
		orientation = 'horizontal',
		ariaLabel = 'Pagination',
		prevLabel = 'Previous page',
		nextLabel = 'Next page',
		class: className,
		buttonClass,
		activeClass,
		ellipsisClass,
	}: Props = $props();

	const buttonClasses =
		'inline-flex size-9 items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50';
</script>

<BitsPagination.Root
	{count}
	{perPage}
	bind:page
	{onPageChange}
	{siblingCount}
	{loop}
	{orientation}
	data-slot="pagination"
	class={cls('flex items-center justify-center', className)}
>
	{#snippet children({ pages, currentPage })}
		<nav aria-label={ariaLabel} class="flex items-center gap-1">
			<BitsPagination.PrevButton
				aria-label={prevLabel}
				data-slot="pagination-prev"
				class={cls(buttonClasses, buttonClass)}
			>
				<ChevronLeftIcon class="size-4" />
			</BitsPagination.PrevButton>

			{#each pages as entry (entry.key)}
				{#if entry.type === 'page'}
					<BitsPagination.Page
						page={entry}
						aria-current={entry.value === currentPage ? 'page' : undefined}
						data-slot="pagination-page"
						class={cls(
							buttonClasses,
							'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary/90',
							activeClass,
							buttonClass,
						)}
					/>
				{:else}
					<span
						aria-hidden="true"
						data-slot="pagination-ellipsis"
						class={cls(
							'flex size-9 items-center justify-center text-muted-foreground',
							ellipsisClass,
						)}
					>
						…
					</span>
				{/if}
			{/each}

			<BitsPagination.NextButton
				aria-label={nextLabel}
				data-slot="pagination-next"
				class={cls(buttonClasses, buttonClass)}
			>
				<ChevronRightIcon class="size-4" />
			</BitsPagination.NextButton>
		</nav>
	{/snippet}
</BitsPagination.Root>
