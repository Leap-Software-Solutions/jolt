<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type DropdownMenuIcon = Component<{ class?: string }>;

	export type DropdownMenuItem = {
		type?: 'item';
		label: string;
		icon?: DropdownMenuIcon;
		shortcut?: string;
		disabled?: boolean;
		variant?: 'default' | 'destructive';
		onSelect?: (event: Event) => void;
		closeOnSelect?: boolean;
	};

	export type DropdownMenuSeparator = {
		type: 'separator';
	};

	export type DropdownMenuGroup = {
		type: 'group';
		label?: string;
		items: DropdownMenuEntry[];
	};

	export type DropdownMenuSubmenu = {
		type: 'submenu';
		label: string;
		icon?: DropdownMenuIcon;
		disabled?: boolean;
		items: DropdownMenuEntry[];
	};

	export type DropdownMenuCheckbox = {
		type: 'checkbox';
		label: string;
		checked?: boolean;
		disabled?: boolean;
		closeOnSelect?: boolean;
		onCheckedChange?: (checked: boolean) => void;
	};

	export type DropdownMenuRadioItem = {
		value: string;
		label: string;
		disabled?: boolean;
		closeOnSelect?: boolean;
	};

	export type DropdownMenuRadio = {
		type: 'radio';
		label?: string;
		value?: string;
		onValueChange?: (value: string) => void;
		items: DropdownMenuRadioItem[];
	};

	export type DropdownMenuEntry =
		| DropdownMenuItem
		| DropdownMenuSeparator
		| DropdownMenuGroup
		| DropdownMenuSubmenu
		| DropdownMenuCheckbox
		| DropdownMenuRadio;

	export type DropdownMenuTriggerProps = Record<string, unknown>;

	export type DropdownMenuAlign = 'start' | 'center' | 'end';
	export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left';

	export type Props = {
		items: DropdownMenuEntry[];
		trigger: Snippet<[DropdownMenuTriggerProps]>;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		align?: DropdownMenuAlign;
		side?: DropdownMenuSide;
		sideOffset?: number;
		class?: string;
		subContentClass?: string;
		itemClass?: string;
	};
</script>

<script lang="ts">
	import { CheckIcon, ChevronRightIcon } from '@lucide/svelte';
	import { DropdownMenu as BitsDropdownMenu } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		items,
		trigger,
		open = $bindable(false),
		onOpenChange,
		align = 'end',
		side = 'bottom',
		sideOffset = 6,
		class: className,
		subContentClass,
		itemClass,
	}: Props = $props();

	const itemClasses =
		'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50';
	const contentClasses =
		'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md';
	const contentMotion =
		'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';
</script>

{#snippet renderEntries(entries: DropdownMenuEntry[])}
	{#each entries as entry, index (index)}
		{#if entry.type === 'separator'}
			<BitsDropdownMenu.Separator class="-mx-1 my-1 h-px bg-border" />
		{:else if entry.type === 'group'}
			<BitsDropdownMenu.Group>
				{#if entry.label}
					<BitsDropdownMenu.GroupHeading
						class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
					>
						{entry.label}
					</BitsDropdownMenu.GroupHeading>
				{/if}
				{@render renderEntries(entry.items)}
			</BitsDropdownMenu.Group>
		{:else if entry.type === 'submenu'}
			<BitsDropdownMenu.Sub>
				<BitsDropdownMenu.SubTrigger
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
				</BitsDropdownMenu.SubTrigger>
				<BitsDropdownMenu.Portal>
					<BitsDropdownMenu.SubContent
						side="right"
						align="start"
						sideOffset={4}
						class={cls(contentClasses, contentMotion, subContentClass)}
					>
						{@render renderEntries(entry.items)}
					</BitsDropdownMenu.SubContent>
				</BitsDropdownMenu.Portal>
			</BitsDropdownMenu.Sub>
		{:else if entry.type === 'checkbox'}
			<BitsDropdownMenu.CheckboxItem
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
			</BitsDropdownMenu.CheckboxItem>
		{:else if entry.type === 'radio'}
			<BitsDropdownMenu.RadioGroup value={entry.value} onValueChange={entry.onValueChange}>
				{#if entry.label}
					<BitsDropdownMenu.GroupHeading
						class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
					>
						{entry.label}
					</BitsDropdownMenu.GroupHeading>
				{/if}
				{#each entry.items as radioItem (radioItem.value)}
					<BitsDropdownMenu.RadioItem
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
					</BitsDropdownMenu.RadioItem>
				{/each}
			</BitsDropdownMenu.RadioGroup>
		{:else}
			<BitsDropdownMenu.Item
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
			</BitsDropdownMenu.Item>
		{/if}
	{/each}
{/snippet}

<BitsDropdownMenu.Root bind:open {onOpenChange}>
	<BitsDropdownMenu.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</BitsDropdownMenu.Trigger>
	<BitsDropdownMenu.Portal>
		<BitsDropdownMenu.Content
			{side}
			{align}
			{sideOffset}
			data-slot="dropdown-menu-content"
			class={cls(contentClasses, contentMotion, className)}
		>
			{@render renderEntries(items)}
		</BitsDropdownMenu.Content>
	</BitsDropdownMenu.Portal>
</BitsDropdownMenu.Root>
