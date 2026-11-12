<script lang="ts">
	import { CheckIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Menubar as BitsMenubar } from 'bits-ui';
	import type { MenuEntry } from '../../types/menu.js';
	import { cls } from '../../utils/index.js';
	import type { Props } from './types.js';

	let {
		menus,
		value = $bindable(''),
		onValueChange,
		loop = true,
		dir,
		ariaLabel = 'Menubar',
		side = 'bottom',
		align = 'start',
		sideOffset = 4,
		class: className,
		triggerClass,
		contentClass,
		itemClass,
		subContentClass,
	}: Props = $props();

	const itemClasses =
		'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50';
	const contentClasses =
		'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md';
	const contentMotion =
		'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';
	const triggerClasses =
		'flex h-7 items-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground';
</script>

{#snippet renderEntries(entries: MenuEntry[])}
	{#each entries as entry, index (index)}
		{#if entry.type === 'separator'}
			<BitsMenubar.Separator class="-mx-1 my-1 h-px bg-border" />
		{:else if entry.type === 'group'}
			<BitsMenubar.Group>
				{#if entry.label}
					<BitsMenubar.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
						{entry.label}
					</BitsMenubar.GroupHeading>
				{/if}
				{@render renderEntries(entry.items)}
			</BitsMenubar.Group>
		{:else if entry.type === 'submenu'}
			<BitsMenubar.Sub>
				<BitsMenubar.SubTrigger
					disabled={entry.disabled}
					class={cls(
						itemClasses,
						'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
						itemClass,
					)}
				>
					{#if entry.icon}
						{@const Icon = entry.icon}
						<Icon class="size-4" />
					{/if}
					<span class="flex-1">{entry.label}</span>
					<ChevronRightIcon class="size-4" />
				</BitsMenubar.SubTrigger>
				<BitsMenubar.Portal>
					<BitsMenubar.SubContent
						side="right"
						align="start"
						sideOffset={4}
						class={cls(contentClasses, contentMotion, subContentClass)}
					>
						{@render renderEntries(entry.items)}
					</BitsMenubar.SubContent>
				</BitsMenubar.Portal>
			</BitsMenubar.Sub>
		{:else if entry.type === 'checkbox'}
			<BitsMenubar.CheckboxItem
				checked={entry.checked ?? false}
				disabled={entry.disabled}
				closeOnSelect={entry.closeOnSelect}
				onCheckedChange={entry.onCheckedChange}
				class={cls(itemClasses, itemClass)}
			>
				{#snippet children({ checked })}
					<span class="flex-1">{entry.label}</span>
					{#if checked}
						<CheckIcon class="size-4" />
					{/if}
				{/snippet}
			</BitsMenubar.CheckboxItem>
		{:else if entry.type === 'radio'}
			<BitsMenubar.RadioGroup value={entry.value} onValueChange={entry.onValueChange}>
				{#if entry.label}
					<BitsMenubar.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
						{entry.label}
					</BitsMenubar.GroupHeading>
				{/if}
				{#each entry.items as radioItem (radioItem.value)}
					<BitsMenubar.RadioItem
						value={radioItem.value}
						disabled={radioItem.disabled}
						closeOnSelect={radioItem.closeOnSelect}
						class={cls(itemClasses, itemClass)}
					>
						{#snippet children({ checked })}
							<span class="flex-1">{radioItem.label}</span>
							{#if checked}
								<span class="size-2 rounded-full bg-current"></span>
							{/if}
						{/snippet}
					</BitsMenubar.RadioItem>
				{/each}
			</BitsMenubar.RadioGroup>
		{:else}
			<BitsMenubar.Item
				disabled={entry.disabled}
				closeOnSelect={entry.closeOnSelect}
				onSelect={entry.onSelect}
				class={cls(
					itemClasses,
					entry.variant === 'destructive' &&
						'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive',
					itemClass,
				)}
			>
				{#if entry.icon}
					{@const Icon = entry.icon}
					<Icon class="size-4" />
				{/if}
				<span class="flex-1">{entry.label}</span>
				{#if entry.shortcut}
					<span class="text-xs tracking-widest text-muted-foreground">
						{entry.shortcut}
					</span>
				{/if}
			</BitsMenubar.Item>
		{/if}
	{/each}
{/snippet}

<BitsMenubar.Root
	bind:value
	{onValueChange}
	{loop}
	{dir}
	aria-label={ariaLabel}
	data-slot="menubar"
	class={cls(
		'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
		className,
	)}
>
	{#each menus as menu (menu.value)}
		<BitsMenubar.Menu value={menu.value}>
			<BitsMenubar.Trigger
				disabled={menu.disabled}
				data-slot="menubar-trigger"
				class={cls(triggerClasses, triggerClass)}
			>
				{#if menu.icon}
					{@const Icon = menu.icon}
					<Icon class="size-4" />
				{/if}
				{menu.label}
			</BitsMenubar.Trigger>

			<BitsMenubar.Portal>
				<BitsMenubar.Content
					{side}
					{align}
					{sideOffset}
					data-slot="menubar-content"
					class={cls(contentClasses, contentMotion, contentClass)}
				>
					{@render renderEntries(menu.items)}
				</BitsMenubar.Content>
			</BitsMenubar.Portal>
		</BitsMenubar.Menu>
	{/each}
</BitsMenubar.Root>
