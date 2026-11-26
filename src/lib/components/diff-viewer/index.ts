export { default as DiffViewer, type Props as DiffViewerProps } from './diff-viewer.svelte';
export { parsePatch } from './parse-patch.js';
export type {
	DiffFile,
	DiffFileStatus,
	DiffHunk,
	DiffLine,
	DiffLineKind,
	DiffViewMode,
} from './types.js';
