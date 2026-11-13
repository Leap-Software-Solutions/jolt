import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

export function highlightCode(code: string, language?: string): string {
	const normalized = language?.toLowerCase();
	if (normalized && hljs.getLanguage(normalized)) {
		return hljs.highlight(code, { language: normalized, ignoreIllegals: true }).value;
	}
	return escapeHtml(code);
}

export function highlightMarkdown(node: HTMLElement): { destroy: () => void } {
	function run(): void {
		for (const block of node.querySelectorAll<HTMLElement>('pre code')) {
			if (!block.classList.contains('hljs')) hljs.highlightElement(block);
		}
	}

	run();

	const observer = new MutationObserver(() => run());
	observer.observe(node, { childList: true, subtree: true, characterData: true });

	return { destroy: () => observer.disconnect() };
}
