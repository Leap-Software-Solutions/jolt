import parseDiff from 'parse-diff';
import type { DiffFile, DiffFileStatus, DiffHunk, DiffLine, DiffLineKind } from './types.js';

const NO_NEWLINE_MARKER = '\\ No newline at end of file';
const BINARY_PATCH = /^GIT binary patch$/m;
const BINARY_DIFF = /^Binary files .* differ$/m;
const COPY_FROM = /^copy from /m;
const RENAME_FROM = /^rename from /m;
const SIMILARITY = /^similarity index (\d+)%$/m;

type FileMetadata = {
	binary: boolean;
	copied: boolean;
	renamed: boolean;
	similarity?: number;
};

const EMPTY_METADATA: FileMetadata = {
	binary: false,
	copied: false,
	renamed: false,
};

function splitFileSections(patch: string): string[] {
	const sections: string[] = [];
	let currentSection: string[] | null = null;

	for (const line of patch.split('\n')) {
		if (line.startsWith('diff --git ')) {
			if (currentSection) sections.push(currentSection.join('\n'));
			currentSection = [line];
			continue;
		}

		if (currentSection) currentSection.push(line);
	}

	if (currentSection) sections.push(currentSection.join('\n'));
	return sections;
}

function getFileMetadata(section: string): FileMetadata {
	const normalized = section.replaceAll('\r\n', '\n');
	const similarityMatch = SIMILARITY.exec(normalized);

	return {
		binary: BINARY_PATCH.test(normalized) || BINARY_DIFF.test(normalized),
		copied: COPY_FROM.test(normalized),
		renamed: RENAME_FROM.test(normalized),
		similarity: similarityMatch ? Number(similarityMatch[1]) : undefined,
	};
}

function getStatus(
	file: ReturnType<typeof parseDiff>[number],
	metadata: FileMetadata,
): DiffFileStatus {
	if (file.new) return 'added';
	if (file.deleted) return 'deleted';
	if (metadata.copied) return 'copied';
	if (metadata.renamed) return 'renamed';
	if (file.from && file.to && file.from !== file.to) return 'renamed';
	if (file.oldMode && file.newMode && file.oldMode !== file.newMode && file.chunks.length === 0) {
		return 'mode-changed';
	}
	return 'modified';
}

function getLineKind(type: string): DiffLineKind {
	if (type === 'add') return 'add';
	if (type === 'del') return 'delete';
	return 'context';
}

function getLineContent(content: string): string {
	return content.slice(1).replace(/\r$/, '');
}

function getLines(
	changes: ReturnType<typeof parseDiff>[number]['chunks'][number]['changes'],
): DiffLine[] {
	const lines: DiffLine[] = [];

	for (const change of changes) {
		const rawContent = change.content.replace(/\r$/, '');
		if (rawContent === NO_NEWLINE_MARKER) {
			const previousLine = lines.at(-1);
			if (previousLine) previousLine.noNewline = true;
			continue;
		}

		const line: DiffLine = {
			kind: getLineKind(change.type),
			content: getLineContent(change.content),
		};

		if ('ln1' in change) line.oldLine = change.ln1;
		if ('ln2' in change) line.newLine = change.ln2;
		if (change.type === 'add') line.newLine = change.ln;
		if (change.type === 'del') line.oldLine = change.ln;

		lines.push(line);
	}

	return lines;
}

function getHunks(chunks: ReturnType<typeof parseDiff>[number]['chunks']): DiffHunk[] {
	return chunks.map((chunk) => ({
		header: chunk.content.replace(/\r$/, ''),
		oldStart: chunk.oldStart,
		oldLines: chunk.oldLines,
		newStart: chunk.newStart,
		newLines: chunk.newLines,
		lines: getLines(chunk.changes),
	}));
}

function getPath(path: string | undefined): string | null {
	if (!path || path === '/dev/null') return null;
	return path;
}

export function parsePatch(patch: string): DiffFile[] {
	const parsedFiles = parseDiff(patch);
	const sections = splitFileSections(patch);
	const useMetadata = sections.length === parsedFiles.length;

	return parsedFiles.map((file, index) => {
		const metadata = useMetadata ? getFileMetadata(sections[index]!) : EMPTY_METADATA;

		return {
			oldPath: getPath(file.from),
			newPath: getPath(file.to),
			status: getStatus(file, metadata),
			binary: metadata.binary,
			additions: file.additions,
			deletions: file.deletions,
			oldMode: file.oldMode,
			newMode: file.newMode,
			similarity: metadata.similarity,
			hunks: getHunks(file.chunks),
		};
	});
}
