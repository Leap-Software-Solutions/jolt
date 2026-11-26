import { getLanguageFromName } from '../../utils/language.js';
import type { LightboxImage, LightboxItem, LightboxTextFormat } from '../lightbox/index.js';
import type { AttachmentItem } from './types.js';

const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const markdownExtension = /\.(md|markdown)$/i;
const textExtension = /\.(txt|text)$/i;

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
	const fileNameLanguage = getLanguageFromName(attachment.name);
	if (fileNameLanguage) return fileNameLanguage;

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
