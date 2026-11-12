<script lang="ts">
	import { cls } from '../../utils/index.js';
	import type { Props, SidebarItem } from './types.js';

	let {
		groups,
		header,
		footer,
		collapsed = $bindable(false),
		class: className,
		itemClass,
		ariaLabel = 'Sidebar navigation',
	}: Props = $props();

	function handleSelect(event: MouseEvent, item: SidebarItem): void {
		if (item.disabled) {
			event.preventDefault();
			return;
		}

		item.onSelect?.();
	}
</script>

<aside
	data-slot="sidebar"
	class={cls(
		'flex h-full flex-col border-e bg-background text-sm transition-[width] duration-200 motion-reduce:transition-none',
		collapsed ? 'w-16' : 'w-64',
		className,
	)}
>
	{#if header}
		<div data-slot="sidebar-header" class="shrink-0 p-2">
			{@render header({ collapsed })}
		</div>
	{/if}

	<nav aria-label={ariaLabel} class="min-h-0 flex-1 overflow-y-auto p-2">
		{#each groups as group, groupIndex (group.label ?? groupIndex)}
			<div data-slot="sidebar-group" class="grid gap-1">
				{#if group.label && !collapsed}
					<p class="px-2.5 pt-3 pb-1 text-xs font-medium text-muted-foreground">
						{group.label}
					</p>
				{/if}

				{#each group.items as item (item.label)}
					{@const Icon = item.icon}
					{#if item.href}
						<a
							href={item.href}
							aria-current={item.active ? 'page' : undefined}
							aria-disabled={item.disabled || undefined}
							tabindex={item.disabled ? -1 : undefined}
							title={collapsed ? item.label : undefined}
							data-active={item.active || undefined}
							class={cls(
								'flex w-full items-center gap-3 rounded-md px-2.5 py-2 font-medium transition-colors outline-none',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
								item.active
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
								item.disabled && 'pointer-events-none opacity-50',
								collapsed && 'justify-center px-2',
								itemClass,
							)}
							onclick={(event) => handleSelect(event, item)}
						>
							{#if Icon}
								<Icon class="size-4 shrink-0" />
							{/if}
							<span class={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
							{#if item.badge && !collapsed}
								<span
									class="ms-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
								>
									{item.badge}
								</span>
							{/if}
						</a>
					{:else}
						<button
							type="button"
							disabled={item.disabled}
							aria-current={item.active ? 'page' : undefined}
							title={collapsed ? item.label : undefined}
							data-active={item.active || undefined}
							class={cls(
								'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left font-medium transition-colors outline-none',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
								item.active
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
								'disabled:pointer-events-none disabled:opacity-50',
								collapsed && 'justify-center px-2',
								itemClass,
							)}
							onclick={() => item.onSelect?.()}
						>
							{#if Icon}
								<Icon class="size-4 shrink-0" />
							{/if}
							<span class={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
							{#if item.badge && !collapsed}
								<span
									class="ms-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
								>
									{item.badge}
								</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		{/each}
	</nav>

	{#if footer}
		<div data-slot="sidebar-footer" class="shrink-0 border-t p-2">
			{@render footer({ collapsed })}
		</div>
	{/if}
</aside>
