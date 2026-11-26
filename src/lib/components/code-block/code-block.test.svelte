<script lang="ts">
	import CodeBlock from './code-block.svelte';

	let {
		code = 'const value: number = 1;',
		showLineNumbers = false,
		highlightLines = [],
		wrap = false,
	}: {
		code?: string;
		showLineNumbers?: boolean;
		highlightLines?: number[];
		wrap?: boolean;
	} = $props();
</script>

<CodeBlock language="typescript" {code} {showLineNumbers} {highlightLines} {wrap} />
