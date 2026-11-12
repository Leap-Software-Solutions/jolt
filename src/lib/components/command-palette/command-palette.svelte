<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	export type CommandPaletteIcon = Component<{ class?: string }>;
	export type CommandPaletteTriggerProps = Record<string, unknown>;

	export type CommandPaletteItem = {
		value: string;
		label: string;
		icon?: CommandPaletteIcon;
		shortcut?: string;
		keywords?: string[];
		disabled?: boolean;
		onSelect?: () => void;
	};

	export type CommandPaletteGroup = {
		heading?: string;
		items: CommandPaletteItem[];
	};

	export type Props = {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		groups: CommandPaletteGroup[];
		trigger?: Snippet<[CommandPaletteTriggerProps]>;
		placeholder?: string;
		emptyText?: string;
		title?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { SearchIcon, XIcon } from '@lucide/svelte';
	import { Command as BitsCommand, Dialog as BitsDialog } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	let {
		open = $bindable(false),
		onOpenChange,
		groups,
		trigger,
		placeholder = 'Search commands…',
		emptyText = 'No commands found.',
		title = 'Command palette',
		class: className,
	}: Props = $props();

	function selectItem(item: CommandPaletteItem): void {
		item.onSelect?.();
		open = false;
	}
</script>

<BitsDialog.Root bind:open {onOpenChange}>
	{#if trigger}
		<BitsDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</BitsDialog.Trigger>
	{/if}

	<BitsDialog.Portal>
		<BitsDialog.Overlay
			data-slot="command-palette-overlay"
			class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<BitsDialog.Content
			data-slot="command-palette-content"
			class={cls(
				'fixed top-[15%] left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl duration-200',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className,
			)}
		>
			<BitsDialog.Title class="sr-only">{title}</BitsDialog.Title>
			<BitsDialog.Description class="sr-only">Search and run a command.</BitsDialog.Description>

			<BitsCommand.Root label={title}>
				<div class="flex items-center gap-2 border-b px-3">
					<SearchIcon class="size-4 shrink-0 text-muted-foreground" />
					<BitsCommand.Input
						autofocus
						{placeholder}
						data-slot="command-palette-input"
						class="flex h-11 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					/>
					<BitsDialog.Close
						type="button"
						aria-label="Close command palette"
						class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
					>
						<XIcon class="size-4" />
					</BitsDialog.Close>
				</div>

				<BitsCommand.List
					data-slot="command-palette-list"
					class="max-h-72 overflow-y-auto overscroll-contain p-1"
				>
					<BitsCommand.Empty class="py-6 text-center text-sm text-muted-foreground">
						{emptyText}
					</BitsCommand.Empty>

					{#each groups as group, groupIndex (group.heading ?? groupIndex)}
						<BitsCommand.Group value={group.heading ?? String(groupIndex)}>
							{#if group.heading}
								<BitsCommand.GroupHeading
									class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
								>
									{group.heading}
								</BitsCommand.GroupHeading>
							{/if}
							{#each group.items as item (item.value)}
								<BitsCommand.Item
									value={item.value}
									keywords={item.keywords}
									disabled={item.disabled}
									onSelect={() => selectItem(item)}
									data-slot="command-palette-item"
									class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground"
								>
									{#if item.icon}
										{@const Icon = item.icon}
										<Icon class="size-4 shrink-0 text-muted-foreground" />
									{/if}
									<span class="min-w-0 flex-1 truncate">{item.label}</span>
									{#if item.shortcut}
										<span class="text-xs tracking-widest text-muted-foreground">
											{item.shortcut}
										</span>
									{/if}
								</BitsCommand.Item>
							{/each}
						</BitsCommand.Group>
					{/each}
				</BitsCommand.List>
			</BitsCommand.Root>
		</BitsDialog.Content>
	</BitsDialog.Portal>
</BitsDialog.Root>
