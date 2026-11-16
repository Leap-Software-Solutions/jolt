import type { LightboxImage, LightboxItem, LightboxTextFormat } from '../lightbox/index.js';
import type { AttachmentItem } from './types.js';

const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const markdownExtension = /\.(md|markdown)$/i;
const textExtension = /\.(txt|text)$/i;

const codeExtensions: Record<string, string> = {
	bash: 'bash',
	c: 'c',
	cc: 'cpp',
	conf: 'ini',
	cpp: 'cpp',
	cs: 'csharp',
	csx: 'csharp',
	css: 'css',
	cts: 'typescript',
	cxx: 'cpp',
	diff: 'diff',
	go: 'go',
	gql: 'graphql',
	graphql: 'graphql',
	h: 'c',
	hh: 'cpp',
	hpp: 'cpp',
	htm: 'xml',
	html: 'xml',
	hxx: 'cpp',
	ini: 'ini',
	java: 'java',
	js: 'javascript',
	json: 'json',
	jsonc: 'json',
	jsx: 'javascript',
	kt: 'kotlin',
	kts: 'kotlin',
	lua: 'lua',
	markdown: 'markdown',
	md: 'markdown',
	mjs: 'javascript',
	mts: 'typescript',
	patch: 'diff',
	php: 'php',
	proto: 'protobuf',
	py: 'python',
	pyw: 'python',
	rb: 'ruby',
	rs: 'rust',
	sh: 'bash',
	sql: 'sql',
	svelte: 'xml',
	swift: 'swift',
	toml: 'ini',
	ts: 'typescript',
	tsx: 'typescript',
	vue: 'xml',
	xhtml: 'xml',
	xml: 'xml',
	yaml: 'yaml',
	yml: 'yaml',
	zsh: 'bash',
};

const codeMimeTypes: Record<string, string> = {
	'application/graphql': 'graphql',
	'application/javascript': 'javascript',
	'application/json': 'json',
	'application/ld+json': 'json',
	'application/protobuf': 'protobuf',
	'application/sql': 'sql',
	'application/toml': 'ini',
	'application/typescript': 'typescript',
	'application/x-httpd-php': 'php',
	'application/x-javascript': 'javascript',
	'application/x-python': 'python',
	'application/x-ruby': 'ruby',
	'application/x-sh': 'bash',
	'application/x-shellscript': 'bash',
	'application/x-yaml': 'yaml',
	'application/xml': 'xml',
	'text/css': 'css',
	'text/html': 'xml',
	'text/javascript': 'javascript',
	'text/typescript': 'typescript',
	'text/x-c': 'c',
	'text/x-c++': 'cpp',
	'text/x-csharp': 'csharp',
	'text/x-go': 'go',
	'text/x-ini': 'ini',
	'text/x-java-source': 'java',
	'text/x-kotlin': 'kotlin',
	'text/x-lua': 'lua',
	'text/x-python': 'python',
	'text/x-rust': 'rust',
	'text/x-sql': 'sql',
	'text/x-swift': 'swift',
	'text/xml': 'xml',
	'text/yaml': 'yaml',
};

const codeFileNames: Record<string, string> = {
	containerfile: 'dockerfile',
	dockerfile: 'dockerfile',
	gnumakefile: 'makefile',
	makefile: 'makefile',
};

function getExtension(name: string): string {
	const dot = name.lastIndexOf('.');
	return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export function isImageAttachment(attachment: AttachmentItem): boolean {
	return Boolean(attachment.type?.startsWith('image/') || imageExtension.test(attachment.name));
}

export function getTextFormat(attachment: AttachmentItem): LightboxTextFormat | null {
	const type = attachment.type?.toLowerCase();

	if (type?.startsWith('text/markdown') || markdownExtension.test(attachment.name)) {
		return 'markdown';
	}
	if (type?.startsWith('text/plain') || textExtension.test(attachment.name)) {
		return 'text';
	}

	return null;
}

export function getCodeLanguage(attachment: AttachmentItem): string | null {
	const name = attachment.name.toLowerCase();
	const baseName = name.split('/').pop() ?? name;
	const fileNameLanguage = codeFileNames[baseName];

	if (fileNameLanguage) return fileNameLanguage;
	if (baseName.startsWith('dockerfile.') || baseName.startsWith('containerfile.')) {
		return 'dockerfile';
	}

	const extensionLanguage = codeExtensions[getExtension(name)];
	if (extensionLanguage) return extensionLanguage;

	const mimeType = attachment.type?.split(';')[0]?.trim().toLowerCase();
	if (mimeType) return codeMimeTypes[mimeType] ?? null;

	return null;
}

export function hasTextPreview(attachment: AttachmentItem): boolean {
	return getTextFormat(attachment) !== null || getCodeLanguage(attachment) !== null;
}

export function getPreviewSrc(attachment: AttachmentItem): string | undefined {
	return attachment.previewSrc ?? attachment.href ?? attachment.thumbnailSrc;
}

export function getThumbnailSrc(attachment: AttachmentItem): string | undefined {
	return attachment.thumbnailSrc ?? attachment.previewSrc ?? attachment.href;
}

export function toLightboxItem(attachment: AttachmentItem): LightboxItem {
	const src = getPreviewSrc(attachment);
	if (isImageAttachment(attachment) && src) {
		const image: LightboxImage = {
			kind: 'image',
			src,
			alt: attachment.alt ?? attachment.name,
			caption: attachment.name,
			downloadUrl: attachment.href,
		};
		return image;
	}

	const format = getTextFormat(attachment);
	const language = getCodeLanguage(attachment);

	if (format === 'markdown' && attachment.content !== undefined) {
		return {
			kind: 'text',
			title: attachment.name,
			content: attachment.content,
			format,
			downloadUrl: attachment.href,
		};
	}

	if (language && attachment.content !== undefined) {
		return {
			kind: 'code',
			title: attachment.name,
			content: attachment.content,
			language,
			downloadUrl: attachment.href,
		};
	}

	if (format === 'text' && attachment.content !== undefined) {
		return {
			kind: 'text',
			title: attachment.name,
			content: attachment.content,
			format,
			downloadUrl: attachment.href,
		};
	}

	return {
		kind: 'file',
		name: attachment.name,
		mimeType: attachment.type,
		downloadUrl: attachment.href,
	};
}
