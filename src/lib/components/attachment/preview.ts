import type { LightboxImage, LightboxItem, LightboxTextFormat } from '../lightbox/index.js';
import type { AttachmentItem } from './types.js';

const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const markdownExtension = /\.(md|markdown)$/i;
const textExtension = /\.(txt|text)$/i;

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
	if (format && attachment.content !== undefined) {
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
