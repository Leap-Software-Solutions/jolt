import { expect, test } from 'vitest';
import { parsePatch } from './parse-patch.js';

const addedModifiedDeletedPatch = [
	'diff --git a/src/added.ts b/src/added.ts',
	'new file mode 100644',
	'index 0000000..1111111',
	'--- /dev/null',
	'+++ b/src/added.ts',
	'@@ -0,0 +1 @@',
	'+export const added = true;',
	'diff --git a/src/app.ts b/src/app.ts',
	'index 1111111..2222222 100644',
	'--- a/src/app.ts',
	'+++ b/src/app.ts',
	'@@ -1,3 +1,4 @@',
	' export const one = 1;',
	'-export const two = 2;',
	'+export const two = 22;',
	' export const three = 3;',
	'+export const four = 4;',
	'diff --git a/src/delete.ts b/src/delete.ts',
	'deleted file mode 100644',
	'index 3333333..0000000',
	'--- a/src/delete.ts',
	'+++ /dev/null',
	'@@ -1 +0,0 @@',
	'-export const removeMe = true;',
].join('\n');

const renameCopyBinaryModePatch = [
	'diff --git a/src/old-name.ts b/src/new-name.ts',
	'similarity index 50%',
	'rename from src/old-name.ts',
	'rename to src/new-name.ts',
	'index 1111111..2222222 100644',
	'--- a/src/old-name.ts',
	'+++ b/src/new-name.ts',
	'@@ -1 +1,2 @@',
	' export const oldName = true;',
	'+export const renamed = true;',
	'diff --git a/src/app.ts b/src/copied.ts',
	'similarity index 100%',
	'copy from src/app.ts',
	'copy to src/copied.ts',
	'diff --git a/src/binary.bin b/src/binary.bin',
	'index 3333333..4444444 100644',
	'GIT binary patch',
	'literal 8',
	'Pc$@',
	'diff --git a/src/script.sh b/src/script.sh',
	'old mode 100644',
	'new mode 100755',
].join('\n');

const lineEndingsPatch = [
	'diff --git a/src/crlf.txt b/src/crlf.txt',
	'--- a/src/crlf.txt',
	'+++ b/src/crlf.txt',
	'@@ -1,2 +1,3 @@',
	' keep me\r',
	'-second line\r',
	'+second line changed\r',
	'+third line\r',
	'diff --git a/src/no-newline.txt b/src/no-newline.txt',
	'--- a/src/no-newline.txt',
	'+++ b/src/no-newline.txt',
	'@@ -1 +1 @@',
	'-no final newline',
	'\\ No newline at end of file',
	'+no final newline changed',
	'\\ No newline at end of file',
].join('\n');

test('classifies added, modified, and deleted files with line numbers', () => {
	const files = parsePatch(addedModifiedDeletedPatch);

	expect(files).toHaveLength(3);
	expect(files[0]).toMatchObject({
		oldPath: null,
		newPath: 'src/added.ts',
		status: 'added',
		additions: 1,
		deletions: 0,
	});
	expect(files[0]?.hunks[0]?.lines).toEqual([
		{ kind: 'add', content: 'export const added = true;', newLine: 1 },
	]);
	expect(files[1]).toMatchObject({
		oldPath: 'src/app.ts',
		newPath: 'src/app.ts',
		status: 'modified',
		additions: 2,
		deletions: 1,
	});
	expect(files[1]?.hunks[0]?.lines).toEqual([
		{ kind: 'context', content: 'export const one = 1;', oldLine: 1, newLine: 1 },
		{ kind: 'delete', content: 'export const two = 2;', oldLine: 2 },
		{ kind: 'add', content: 'export const two = 22;', newLine: 2 },
		{ kind: 'context', content: 'export const three = 3;', oldLine: 3, newLine: 3 },
		{ kind: 'add', content: 'export const four = 4;', newLine: 4 },
	]);
	expect(files[2]).toMatchObject({
		oldPath: 'src/delete.ts',
		newPath: null,
		status: 'deleted',
		additions: 0,
		deletions: 1,
	});
});

test('reads rename, copy, binary, and mode-only metadata', () => {
	const files = parsePatch(renameCopyBinaryModePatch);

	expect(files[0]).toMatchObject({
		oldPath: 'src/old-name.ts',
		newPath: 'src/new-name.ts',
		status: 'renamed',
		similarity: 50,
		binary: false,
	});
	expect(files[1]).toMatchObject({
		oldPath: 'src/app.ts',
		newPath: 'src/copied.ts',
		status: 'copied',
		similarity: 100,
		hunks: [],
	});
	expect(files[2]).toMatchObject({
		oldPath: 'src/binary.bin',
		newPath: 'src/binary.bin',
		status: 'modified',
		binary: true,
		hunks: [],
	});
	expect(files[3]).toMatchObject({
		oldPath: 'src/script.sh',
		newPath: 'src/script.sh',
		status: 'mode-changed',
		oldMode: '100644',
		newMode: '100755',
	});
});

test('normalizes CRLF and records missing final newlines', () => {
	const files = parsePatch(lineEndingsPatch);

	expect(files[0]?.hunks[0]?.lines).toEqual([
		{ kind: 'context', content: 'keep me', oldLine: 1, newLine: 1 },
		{ kind: 'delete', content: 'second line', oldLine: 2 },
		{ kind: 'add', content: 'second line changed', newLine: 2 },
		{ kind: 'add', content: 'third line', newLine: 3 },
	]);
	expect(files[1]?.hunks[0]?.lines).toEqual([
		{ kind: 'delete', content: 'no final newline', oldLine: 1, noNewline: true },
		{ kind: 'add', content: 'no final newline changed', newLine: 1, noNewline: true },
	]);
});

test('keeps paths with spaces and returns no files for an empty patch', () => {
	const files = parsePatch(
		[
			'diff --git a/src/space name.txt b/src/space name.txt',
			'--- a/src/space name.txt',
			'+++ b/src/space name.txt',
			'@@ -1 +1 @@',
			'-first',
			'+second',
		].join('\n'),
	);

	expect(files[0]).toMatchObject({
		oldPath: 'src/space name.txt',
		newPath: 'src/space name.txt',
		status: 'modified',
	});
	expect(parsePatch('')).toEqual([]);
});

test('marks binary files without a binary patch body', () => {
	const files = parsePatch(
		[
			'diff --git a/image.png b/image.png',
			'index 1111111..2222222 100644',
			'Binary files a/image.png and b/image.png differ',
		].join('\n'),
	);

	expect(files[0]).toMatchObject({
		oldPath: 'image.png',
		newPath: 'image.png',
		status: 'modified',
		binary: true,
	});
});
