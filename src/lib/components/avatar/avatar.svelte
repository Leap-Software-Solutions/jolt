<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type AvatarSize = 'sm' | 'default' | 'lg' | 'xl';

	export type Props = {
		src?: string;
		alt: string;
		initials?: string;
		fallback?: Snippet;
		size?: AvatarSize;
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

	let {
		src,
		alt,
		initials,
		fallback,
		size = 'default',
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
</script>

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
