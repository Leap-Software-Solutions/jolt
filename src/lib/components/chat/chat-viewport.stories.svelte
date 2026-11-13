<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatViewport, { type Props as ChatViewportProps } from './chat-viewport.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat viewport',
		component: ChatViewport,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});

	type TemplateArgs = Omit<ChatViewportProps, 'children'>;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="h-[26rem] w-[34rem] max-w-full overflow-hidden rounded-xl border bg-background">
		<ChatViewport {...args}>
			<div class="grid gap-4 p-4">
				{#each Array.from({ length: 10 }, (_, index) => index + 1) as item (item)}
					<div
						class:ml-auto={item % 2 === 0}
						class="max-w-[80%] rounded-xl bg-muted px-4 py-2 text-sm"
					>
						Message {item}: a short piece of conversation content.
					</div>
				{/each}
			</div>
		</ChatViewport>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="Without auto-scroll" args={{ autoScroll: false }} {template} />
