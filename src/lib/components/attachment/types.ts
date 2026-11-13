export type AttachmentSize = 'sm' | 'default';

export type AttachmentItem = {
	id: string;
	name: string;
	size?: number;
	type?: string;
	href?: string;
	previewSrc?: string;
	thumbnailSrc?: string;
	alt?: string;
	content?: string;
};
