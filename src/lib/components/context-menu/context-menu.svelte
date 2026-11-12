<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type {
		MenuCheckbox,
		MenuEntry,
		MenuGroup,
		MenuIcon,
		MenuItem,
		MenuRadio,
		MenuRadioItem,
		MenuSeparator as SharedMenuSeparator,
		MenuSubmenu,
	} from '../../types/menu.js';

	export type ContextMenuIcon = MenuIcon;
	export type ContextMenuItem = MenuItem;
	export type ContextMenuSeparator = SharedMenuSeparator;
	export type ContextMenuGroup = MenuGroup;
	export type ContextMenuSubmenu = MenuSubmenu;
	export type ContextMenuCheckbox = MenuCheckbox;
	export type ContextMenuRadioItem = MenuRadioItem;
	export type ContextMenuRadio = MenuRadio;
	export type ContextMenuEntry = MenuEntry;

	export type ContextMenuTriggerProps = Record<string, unknown>;

	export type Props = {
		items: ContextMenuEntry[];
		trigger: Snippet<[ContextMenuTriggerProps]>;
		class?: string;
		subContentClass?: string;
		itemClass?: string;
	};
</script>

<script lang="ts">
	import { CheckIcon, ChevronRightIcon } from '@lucide/svelte';
	import { ContextMenu as BitsContextMenu } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let { items, trigger, class: className, subContentClass, itemClass }: Props = $props();

	const itemClasses =
		'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50';
	const contentClasses =
		'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md';
	const contentMotion =
		'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';
</script>

{#snippet renderEntries(entries: ContextMenuEntry[])}
	{#each entries as entry, index (index)}
		{#if entry.type === 'separator'}
			<BitsContextMenu.Separator class="-mx-1 my-1 h-px bg-border" />
		{:else if entry.type === 'group'}
			<BitsContextMenu.Group>
				{#if entry.label}
					<BitsContextMenu.GroupHeading
						class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
					>
						{entry.label}
					</BitsContextMenu.GroupHeading>
				{/if}
				{@render renderEntries(entry.items)}
			</BitsContextMenu.Group>
		{:else if entry.type === 'submenu'}
			<BitsContextMenu.Sub>
				<BitsContextMenu.SubTrigger
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
				</BitsContextMenu.SubTrigger>
				<BitsContextMenu.Portal>
					<BitsContextMenu.SubContent
						side="right"
						align="start"
						sideOffset={4}
						class={cls(contentClasses, contentMotion, subContentClass)}
					>
						{@render renderEntries(entry.items)}
					</BitsContextMenu.SubContent>
				</BitsContextMenu.Portal>
			</BitsContextMenu.Sub>
		{:else if entry.type === 'checkbox'}
			<BitsContextMenu.CheckboxItem
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
			</BitsContextMenu.CheckboxItem>
		{:else if entry.type === 'radio'}
			<BitsContextMenu.RadioGroup value={entry.value} onValueChange={entry.onValueChange}>
				{#if entry.label}
					<BitsContextMenu.GroupHeading
						class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
					>
						{entry.label}
					</BitsContextMenu.GroupHeading>
				{/if}
				{#each entry.items as radioItem (radioItem.value)}
					<BitsContextMenu.RadioItem
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
					</BitsContextMenu.RadioItem>
				{/each}
			</BitsContextMenu.RadioGroup>
		{:else}
			<BitsContextMenu.Item
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
			</BitsContextMenu.Item>
		{/if}
	{/each}
{/snippet}

<BitsContextMenu.Root>
	<BitsContextMenu.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</BitsContextMenu.Trigger>
	<BitsContextMenu.Portal>
		<BitsContextMenu.Content
			data-slot="context-menu-content"
			class={cls(contentClasses, contentMotion, className)}
		>
			{@render renderEntries(items)}
		</BitsContextMenu.Content>
	</BitsContextMenu.Portal>
</BitsContextMenu.Root>
