<script lang="ts" module>
	import type { AvatarSize, AvatarStatus } from '../avatar/index.js';

	export type AvatarGroupItem = {
		src?: string;
		alt: string;
		initials?: string;
		status?: AvatarStatus;
		statusLabel?: string;
	};

	export type Props = {
		items: AvatarGroupItem[];
		max?: number;
		size?: AvatarSize;
		ariaLabel?: string;
		class?: string;
		avatarClass?: string;
	};
</script>

<script lang="ts">
	import { cls } from '../../utils/index.js';
	import { Avatar } from '../avatar/index.js';

	let {
		items,
		max = 4,
		size = 'default',
		ariaLabel,
		class: className,
		avatarClass,
	}: Props = $props();

	const visibleItems = $derived(items.slice(0, Math.max(0, max)));
	const overflowCount = $derived(Math.max(0, items.length - visibleItems.length));
	const groupLabel = $derived(ariaLabel ?? `${items.length} people`);
	const overflowSizeClasses: Record<AvatarSize, string> = {
		sm: 'size-8 text-xs',
		default: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg',
	};
</script>

<div
	role="group"
	aria-label={groupLabel}
	data-slot="avatar-group"
	class={cls('flex items-center -space-x-2', className)}
>
	{#each visibleItems as item, index (index)}
		<div class="relative rounded-full ring-2 ring-background" data-slot="avatar-group-item">
			<Avatar
				src={item.src}
				alt={item.alt}
				initials={item.initials}
				status={item.status}
				statusLabel={item.statusLabel}
				{size}
				class={avatarClass}
			/>
		</div>
	{/each}

	{#if overflowCount > 0}
		<span
			aria-label={`${overflowCount} more`}
			title={`${overflowCount} more`}
			data-slot="avatar-group-overflow"
			class={cls(
				'relative flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background',
				overflowSizeClasses[size],
			)}
		>
			+{overflowCount}
		</span>
	{/if}
</div>
