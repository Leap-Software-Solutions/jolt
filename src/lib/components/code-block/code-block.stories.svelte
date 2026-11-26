<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CodeBlock from './code-block.svelte';

	const { Story } = defineMeta({
		title: 'Data Display/Code Block',
		component: CodeBlock,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: {
	code: string;
	language?: string;
	showLineNumbers?: boolean;
	highlightLines?: number[];
	wrap?: boolean;
})}
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

<Story
	name="Plain text"
	args={{ language: 'text', code: 'npm install @leap-online/jolt' }}
	{template}
/>

<Story
	name="Without copy"
	args={{ language: 'bash', copyable: false, code: 'pnpm build' }}
	{template}
/>

<Story
	name="Line numbers"
	args={{
		language: 'typescript',
		showLineNumbers: true,
		code: `type Message = {\n  id: string;\n  role: 'user' | 'assistant';\n  content: string;\n};\n\nfunction isUser(message: Message): boolean {\n  return message.role === 'user';\n}`,
	}}
	{template}
/>

<Story
	name="Highlighted lines"
	args={{
		language: 'typescript',
		showLineNumbers: true,
		highlightLines: [4, 5],
		code: `function greet(name: string) {\n  return 'Hello, ' + name;\n}\n\nconst message = greet('Ada');\nconsole.log(message);`,
	}}
	{template}
/>

<Story
	name="Wrapped"
	args={{
		language: 'typescript',
		wrap: true,
		code: 'const message = "This is a deliberately long line that should wrap inside the code block instead of overflowing horizontally.";',
	}}
	{template}
/>
