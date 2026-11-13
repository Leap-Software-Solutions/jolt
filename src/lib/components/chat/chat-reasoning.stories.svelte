<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatReasoning from './chat-reasoning.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat reasoning',
		component: ChatReasoning,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: { label?: string; duration?: string })}
	<div class="w-[36rem] max-w-full">
		<ChatReasoning {...args}>
			I checked the component exports, then compared the calendar and date range picker APIs before
			choosing a shared range value.
		</ChatReasoning>
	</div>
{/snippet}

<Story name="Default" {template} />

<Story name="With duration" args={{ duration: '8 seconds' }} {template} />
