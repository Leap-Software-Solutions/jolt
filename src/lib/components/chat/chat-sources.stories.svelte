<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatSources from './chat-sources.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat Sources',
		component: ChatSources,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			sources: [
				{ label: 'Component guidelines', href: 'https://example.com/guidelines' },
				{ label: 'Import rules', href: 'https://example.com/imports' },
				{ label: 'Release notes' },
			],
		},
	});
</script>

<Story name="Default" asChild>
	<div class="w-[32rem] max-w-full">
		<ChatSources
			sources={[
				{ label: 'Component guidelines', href: 'https://example.com/guidelines' },
				{ label: 'Import rules', href: 'https://example.com/imports' },
				{ label: 'Release notes' },
			]}
		/>
	</div>
</Story>
