<script lang="ts" module>
	export type Props = {
		content: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { marked } from 'marked';
	import sanitizeHtml from 'sanitize-html';
	import { highlightMarkdown } from '../../utils/highlight.js';
	import { cls } from '../../utils/index.js';

	const sanitizeOptions: sanitizeHtml.IOptions = {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			'img',
			'del',
			's',
			'pre',
			'code',
			'table',
			'thead',
			'tbody',
			'tr',
			'th',
			'td',
			'hr',
		],
		allowedAttributes: {
			a: ['href', 'title', 'target', 'rel'],
			img: ['src', 'alt', 'title', 'width', 'height'],
			code: ['class'],
			pre: ['class'],
			span: ['class'],
			th: ['align'],
			td: ['align'],
		},
		allowedSchemes: ['http', 'https', 'mailto'],
	};

	let { content, class: className }: Props = $props();

	const safeHtml = $derived(
		sanitizeHtml(marked.parse(content, { async: false, gfm: true, breaks: true }), sanitizeOptions),
	);
</script>

<div data-slot="markdown" class={cls('jolt-prose text-sm', className)} use:highlightMarkdown>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- the generated HTML is sanitized above -->
	{@html safeHtml}
</div>
