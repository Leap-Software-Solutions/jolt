<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import { cls } from '../../utils/index.js';
	import { Avatar } from '../avatar/index.js';
	import type { Props, UserChipSize } from './types.js';

	let {
		name,
		avatarSrc,
		initials,
		status,
		statusLabel,
		meta,
		size = 'sm',
		onRemove,
		removeLabel,
		class: className,
	}: Props = $props();

	const nameClasses: Record<UserChipSize, string> = {
		sm: 'text-xs',
		default: 'text-sm',
		lg: 'text-base',
		xl: 'text-lg',
	};
</script>

<span
	data-slot="user-chip"
	class={cls(
		'inline-flex min-w-0 items-center gap-2 rounded-full border bg-card py-1 ps-1',
		onRemove ? 'pe-1.5' : 'pe-3',
		className,
	)}
>
	<Avatar src={avatarSrc} alt={name} {initials} {status} {statusLabel} {size} />
	<span class="min-w-0">
		<span class={cls('block truncate font-medium', nameClasses[size])}>{name}</span>
		{#if meta}
			<span data-slot="user-chip-meta" class="block truncate text-xs text-muted-foreground">
				{meta}
			</span>
		{/if}
	</span>
	{#if onRemove}
		<button
			type="button"
			aria-label={removeLabel ?? `Remove ${name}`}
			class="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
			onclick={onRemove}
		>
			<XIcon aria-hidden="true" class="size-3.5" />
		</button>
	{/if}
</span>
