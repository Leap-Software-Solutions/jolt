<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
	import { cls } from '../../utils/index.js';
	import type { NavigationMenuLinkItem, Props } from './types.js';

	let {
		items,
		value = $bindable(''),
		onValueChange,
		trigger: triggerSnippet,
		ariaLabel = 'Main navigation',
		orientation = 'horizontal',
		delayDuration = 200,
		skipDelayDuration = 300,
		class: className,
		listClass,
		itemClass,
		triggerClass,
		contentClass,
		linkClass,
		viewportClass,
	}: Props = $props();

	const triggerClasses =
		'group inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50';
	const linkClasses =
		'flex h-9 w-max items-center justify-center gap-1.5 rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden data-[active]:bg-accent data-[active]:text-accent-foreground';

	function handleLinkSelect(event: Event, item: NavigationMenuLinkItem): void {
		if (item.disabled) {
			event.preventDefault();
			return;
		}

		item.onSelect?.(event);
	}
</script>

<BitsNavigationMenu.Root
	bind:value
	{onValueChange}
	{orientation}
	{delayDuration}
	{skipDelayDuration}
	aria-label={ariaLabel}
	data-slot="navigation-menu"
	class={cls('relative flex max-w-max flex-1 items-center justify-center', className)}
>
	<BitsNavigationMenu.List
		data-slot="navigation-menu-list"
		class={cls('group flex flex-1 list-none items-center justify-center gap-1', listClass)}
	>
		{#each items as item (item.value)}
			<BitsNavigationMenu.Item
				value={item.value}
				data-slot="navigation-menu-item"
				class={cls('relative', itemClass)}
			>
				{#if item.content}
					<BitsNavigationMenu.Trigger
						disabled={item.disabled}
						data-slot="navigation-menu-trigger"
						class={cls(triggerClasses, triggerClass)}
					>
						{#if triggerSnippet}
							{@render triggerSnippet(item)}
						{:else}
							{#if item.icon}
								{@const Icon = item.icon}
								<Icon class="size-4" />
							{/if}
							<span>{item.label}</span>
						{/if}
						<ChevronDownIcon
							class="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
						/>
					</BitsNavigationMenu.Trigger>

					<BitsNavigationMenu.Content
						data-slot="navigation-menu-content"
						class={cls('grid gap-1 p-2', contentClass)}
					>
						{@render item.content(item)}
					</BitsNavigationMenu.Content>
				{:else}
					<BitsNavigationMenu.Link
						href={item.href}
						active={item.active}
						onSelect={(event) => handleLinkSelect(event, item)}
						aria-disabled={item.disabled || undefined}
						tabindex={item.disabled ? -1 : undefined}
						data-slot="navigation-menu-link"
						class={cls(
							linkClasses,
							item.active && 'data-[active]:bg-accent data-[active]:text-accent-foreground',
							item.disabled && 'pointer-events-none opacity-50',
							linkClass,
						)}
					>
						{#if item.icon}
							{@const Icon = item.icon}
							<Icon class="size-4" />
						{/if}
						<span>{item.label}</span>
					</BitsNavigationMenu.Link>
				{/if}
			</BitsNavigationMenu.Item>
		{/each}
	</BitsNavigationMenu.List>

	<div
		data-slot="navigation-menu-viewport-wrapper"
		class="absolute start-0 top-full isolate z-50 flex justify-center"
	>
		<BitsNavigationMenu.Viewport
			data-slot="navigation-menu-viewport"
			class={cls(
				'origin-top-center relative mt-1.5 h-[calc(var(--bits-navigation-menu-viewport-height)+1rem)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md md:w-[calc(var(--bits-navigation-menu-viewport-width)+1rem)]',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				viewportClass,
			)}
		/>
	</div>
</BitsNavigationMenu.Root>
