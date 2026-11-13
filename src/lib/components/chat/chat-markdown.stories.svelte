<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatMarkdown from './chat-markdown.svelte';

	const { Story } = defineMeta({
		title: 'Chat/Markdown',
		component: ChatMarkdown,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

{#snippet template(args: { content: string })}
	<div class="w-[38rem] max-w-full">
		<ChatMarkdown {...args} />
	</div>
{/snippet}

<Story
	name="Markdown"
	args={{
		content: `## A helpful answer\n\nUse **Markdown** for rich assistant responses, with [links](https://example.com) and lists.\n\n- One point\n- Another point\n\n> A quoted detail from the source.\n\n\`inline code\` stays readable in running text.`,
	}}
	{template}
/>

<Story
	name="Code"
	args={{
		content: '```typescript\nconst message: string = "Hello";\nconsole.log(message);\n```',
	}}
	{template}
/>

<Story
	name="Table"
	args={{
		content: '| Component | Status |\n| --- | --- |\n| Chat | Ready |\n| Tool calls | Next |',
	}}
	{template}
/>

<Story
	name="Sanitized HTML"
	args={{
		content:
			'A safe paragraph.\n\n<script>alert("not allowed")</script>\n\n[Safe link](https://example.com)',
	}}
	{template}
/>

<Story
	name="Inline formatting"
	args={{
		content:
			'**Bold text**, *italic text*, ~~struck-through text~~, `inline code`, and a [link](https://example.com).',
	}}
	{template}
/>

<Story
	name="Blocks"
	args={{
		content: `# Heading level one

## Heading level two

### Heading level three

#### Heading level four

A paragraph with **bold**, *italic*, ~~strikethrough~~, \`inline code\`, and a [link](https://example.com).

- First bullet
- Second bullet
  - Nested bullet
  - Another nested bullet

1. First ordered item
2. Second ordered item

> A blockquote with **emphasis**.

---

| Component | Status | Notes |
| --- | --- | --- |
| Chat | Ready | Markdown |
| Tool calls | Next | Streaming |

![A placeholder image](https://placehold.co/640x240/png?text=Jolt+Markdown)`,
	}}
	{template}
/>

<Story
	name="Code languages"
	args={{
		content:
			'```bash\npnpm add @leap/jolt\n```\n\n```json\n{ "name": "jolt", "private": true }\n```\n\n```python\ndef greet(name: str) -> str:\n    return f"Hello, {name}"\n```\n\n```sql\nselect id, name from components where status = "ready";\n```\n\n```css\n.chat-bubble { color: var(--foreground); }\n```\n\n```javascript\nconst message = "Hello";\n```\n\n```typescript\nconst message: string = "Hello";\n```\n\n```xml\n<message role="user">Hello</message>\n```',
	}}
	{template}
/>
