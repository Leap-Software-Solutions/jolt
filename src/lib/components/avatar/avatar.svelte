<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type AvatarSize = 'sm' | 'default' | 'lg' | 'xl';
	export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

	export type Props = {
		src?: string;
		alt: string;
		initials?: string;
		fallback?: Snippet;
		size?: AvatarSize;
		status?: AvatarStatus;
		statusLabel?: string;
		class?: string;
		imageClass?: string;
		fallbackClass?: string;
	};
</script>

<script lang="ts">
	import { Avatar as BitsAvatar } from 'bits-ui';
	import { cls } from '../../utils/index.js';

	const sizeClasses: Record<AvatarSize, string> = {
		sm: 'size-8 text-xs',
		default: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg',
	};
	const statusSizeClasses: Record<AvatarSize, string> = {
		sm: 'size-2',
		default: 'size-2.5',
		lg: 'size-3',
		xl: 'size-3.5',
	};
	const statusClasses: Record<AvatarStatus, string> = {
		online: 'bg-success',
		away: 'bg-brand',
		busy: 'bg-destructive',
		offline: 'bg-muted-foreground',
	};
	const statusLabels: Record<AvatarStatus, string> = {
		online: 'Online',
		away: 'Away',
		busy: 'Busy',
		offline: 'Offline',
	};

	let {
		src,
		alt,
		initials,
		fallback,
		size = 'default',
		status,
		statusLabel,
		class: className,
		imageClass,
		fallbackClass,
	}: Props = $props();

	function getInitials(name: string): string {
		const parts = name.trim().split(/\s+/).filter(Boolean);
		if (parts.length === 0) return '?';
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
	}

	const fallbackText = $derived(initials ?? getInitials(alt));
	const statusText = $derived(status ? (statusLabel ?? statusLabels[status]) : '');
</script>

<span class="relative inline-flex shrink-0" data-slot="avatar-presence">
	<BitsAvatar.Root
		data-slot="avatar"
		class={cls('relative flex shrink-0 overflow-hidden rounded-full', sizeClasses[size], className)}
	>
		{#if src}
			<BitsAvatar.Image
				{src}
				{alt}
				data-slot="avatar-image"
				class={cls('aspect-square size-full object-cover', imageClass)}
			/>
		{/if}
		<BitsAvatar.Fallback
			data-slot="avatar-fallback"
			class={cls(
				'flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
				fallbackClass,
			)}
		>
			{#if fallback}
				{@render fallback()}
			{:else}
				{fallbackText}
			{/if}
		</BitsAvatar.Fallback>
	</BitsAvatar.Root>

	{#if status}
		<span
			data-slot="avatar-status"
			role="img"
			aria-label={statusText}
			title={statusText}
			class={cls(
				'absolute end-0 bottom-0 z-10 rounded-full ring-2 ring-background',
				statusSizeClasses[size],
				statusClasses[status],
			)}
		></span>
	{/if}
</span>
