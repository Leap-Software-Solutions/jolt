export type DiffFileStatus =
	'added' | 'deleted' | 'modified' | 'renamed' | 'copied' | 'mode-changed';

export type DiffLineKind = 'context' | 'add' | 'delete';

export type DiffLine = {
	kind: DiffLineKind;
	content: string;
	oldLine?: number;
	newLine?: number;
	noNewline?: boolean;
};

export type DiffHunk = {
	header: string;
	oldStart: number;
	oldLines: number;
	newStart: number;
	newLines: number;
	lines: DiffLine[];
};

export type DiffFile = {
	oldPath: string | null;
	newPath: string | null;
	status: DiffFileStatus;
	binary: boolean;
	additions: number;
	deletions: number;
	oldMode?: string;
	newMode?: string;
	similarity?: number;
	hunks: DiffHunk[];
};
