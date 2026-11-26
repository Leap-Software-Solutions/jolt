import { mount, tick, unmount } from 'svelte';
import { expect, test } from 'vitest';
import DiffViewerTest from './diff-viewer.test.svelte';

const patch = [
	'diff --git a/src/app.ts b/src/app.ts',
	'index 1111111..2222222 100644',
	'--- a/src/app.ts',
	'+++ b/src/app.ts',
	'@@ -1,2 +1,3 @@',
	' export const one = 1;',
	'-export const two = 2;',
	'+export const two = 22;',
	'+export const four = 4;',
].join('\n');

const whitespacePatch = [
	'diff --git a/src/indent.ts b/src/indent.ts',
	'--- a/src/indent.ts',
	'+++ b/src/indent.ts',
	'@@ -1 +1 @@',
	'-const value = 1;',
	'+  const\tvalue = 2;',
].join('\n');

const metadataPatch = [
	'diff --git a/src/old.ts b/src/new.ts',
	'similarity index 100%',
	'rename from src/old.ts',
	'rename to src/new.ts',
	'diff --git a/src/binary.bin b/src/binary.bin',
	'index 3333333..4444444 100644',
	'GIT binary patch',
	'literal 8',
	'Pc$@',
	'diff --git a/src/script.sh b/src/script.sh',
	'old mode 100644',
	'new mode 100755',
].join('\n');

test('renders a unified diff with line numbers, markers, and stats', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DiffViewerTest, { target, props: { patch } });
	await tick();

	const file = target.querySelector<HTMLElement>('[data-slot="diff-file"]');
	const lines = target.querySelectorAll<HTMLElement>('[data-slot="diff-line"]');

	expect(file?.dataset.status).toBe('modified');
	expect(file?.textContent).toContain('src/app.ts');
	expect(file?.textContent).toContain('+2');
	expect(file?.textContent).toContain('-1');
	expect(file?.textContent).toContain('2 additions, 1 deletions');
	expect(target.textContent).toContain('@@ -1,2 +1,3 @@');
	expect(lines).toHaveLength(4);
	expect(lines[0]?.dataset.kind).toBe('context');
	expect(lines[1]?.dataset.kind).toBe('delete');
	expect(lines[2]?.dataset.kind).toBe('add');
	expect(lines[2]?.textContent).toContain('+');
	expect(lines[2]?.textContent).toContain('export const two = 22;');
	expect(lines[2]?.querySelector('.hljs-keyword')).not.toBeNull();

	unmount(app);
	target.remove();
});

test('renders a split diff with delete and add cells aligned', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DiffViewerTest, { target, props: { patch, view: 'split' } });
	await tick();

	const rows = target.querySelectorAll<HTMLElement>('[data-slot="diff-split-cell"]');

	expect(target.querySelector('[data-slot="diff-line"]')).toBeNull();
	expect(rows).toHaveLength(6);
	expect(rows[2]?.dataset.kind).toBe('delete');
	expect(rows[3]?.dataset.kind).toBe('add');
	expect(rows[3]?.textContent).toContain('export const two = 22;');

	unmount(app);
	target.remove();
});

test('renders binary, rename, and mode-only notices', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DiffViewerTest, { target, props: { patch: metadataPatch } });
	await tick();

	const files = target.querySelectorAll<HTMLElement>('[data-slot="diff-file"]');

	expect(files[0]?.dataset.status).toBe('renamed');
	expect(files[0]?.textContent).toContain('src/old.ts → src/new.ts');
	expect(files[0]?.textContent).toContain('File renamed without content changes.');
	expect(files[1]?.textContent).toContain('Binary file.');
	expect(files[2]?.textContent).toContain('File mode changed from 100644 to 100755.');

	unmount(app);
	target.remove();
});

test('shows visible whitespace characters when requested', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DiffViewerTest, { target, props: { patch: whitespacePatch } });
	await tick();
	expect(target.textContent).not.toContain('··const→value');

	await unmount(app);

	const visibleApp = mount(DiffViewerTest, {
		target,
		props: { patch: whitespacePatch, showWhitespace: true },
	});
	await tick();

	expect(target.textContent).toContain('··const→value');

	unmount(visibleApp);
	target.remove();
});

test('renders the empty state for an empty patch', async () => {
	const target = document.createElement('div');
	document.body.appendChild(target);

	const app = mount(DiffViewerTest, { target, props: { patch: '' } });
	await tick();

	expect(target.textContent).toContain('No changes.');

	unmount(app);
	target.remove();
});
