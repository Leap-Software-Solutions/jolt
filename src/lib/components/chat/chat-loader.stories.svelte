<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatLoader from './chat-loader.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Chat loader',
		component: ChatLoader,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default" />

<Story name="Custom label" args={{ label: 'Looking through the codebase' }} />
