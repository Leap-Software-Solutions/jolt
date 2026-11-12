<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { avatarAlt, avatarSrc } from '../../../docs/fixtures/avatar.js';
	import type { AvatarSize, Props as AvatarProps } from './avatar.svelte';
	import Avatar from './avatar.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Avatar',
		component: Avatar,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			alt: avatarAlt,
		},
	});

	const sizes: AvatarSize[] = ['sm', 'default', 'lg', 'xl'];

	type TemplateArgs = Omit<AvatarProps, 'fallback' | 'src'>;
</script>

{#snippet template(args: TemplateArgs)}
	<Avatar src={avatarSrc} {...args} />
{/snippet}

{#snippet fallbackTemplate(args: TemplateArgs)}
	<Avatar {...args} />
{/snippet}

{#snippet customFallbackTemplate(args: TemplateArgs)}
	<Avatar {...args}>
		{#snippet fallback()}
			<span class="text-foreground">AL</span>
		{/snippet}
	</Avatar>
{/snippet}

<Story name="With image" {template} />

<Story name="Fallback initials" template={fallbackTemplate} />

<Story name="Custom fallback" template={customFallbackTemplate} />

<Story name="Sizes" asChild>
	<div class="flex items-end gap-4">
		{#each sizes as size (size)}
			<Avatar src={avatarSrc} alt={avatarAlt} {size} />
		{/each}
	</div>
</Story>

<Story
	name="Custom initials"
	args={{ alt: 'Grace Hopper', initials: 'GH' }}
	template={fallbackTemplate}
/>
