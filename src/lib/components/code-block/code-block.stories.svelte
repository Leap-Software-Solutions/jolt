<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CodeBlock from './code-block.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Code block',
		component: CodeBlock,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: { code: string; language?: string })}
	<div class="w-[36rem] max-w-full">
		<CodeBlock {...args} />
	</div>
{/snippet}

<Story
	name="TypeScript"
	args={{
		language: 'typescript',
		code: `type Message = {\n  id: string;\n  role: 'user' | 'assistant';\n  content: string;\n};\n\nfunction isUser(message: Message): boolean {\n  return message.role === 'user';\n}`,
	}}
	{template}
/>

<Story
	name="JSON"
	args={{
		language: 'json',
		code: `{\n  "model": "jolt",\n  "stream": true,\n  "temperature": 0.2\n}`,
	}}
	{template}
/>

<Story name="Plain text" args={{ language: 'text', code: 'npm install @leap/jolt' }} {template} />

<Story
	name="Without copy"
	args={{ language: 'bash', copyable: false, code: 'pnpm build' }}
	{template}
/>
