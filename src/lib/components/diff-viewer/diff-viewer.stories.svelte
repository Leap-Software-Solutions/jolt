<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Props as DiffViewerProps } from './diff-viewer.svelte';
	import DiffViewer from './diff-viewer.svelte';

	const patch = [
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
		'diff --git a/src/added.ts b/src/added.ts',
		'new file mode 100644',
		'index 0000000..3333333',
		'--- /dev/null',
		'+++ b/src/added.ts',
		'@@ -0,0 +1,2 @@',
		'+export const added = true;',
		'+export const alsoAdded = true;',
		'diff --git a/src/delete.ts b/src/delete.ts',
		'deleted file mode 100644',
		'index 4444444..0000000',
		'--- a/src/delete.ts',
		'+++ /dev/null',
		'@@ -1 +0,0 @@',
		'-export const removeMe = true;',
	].join('\n');

	const metadataPatch = [
		'diff --git a/src/old-name.ts b/src/new-name.ts',
		'similarity index 80%',
		'rename from src/old-name.ts',
		'rename to src/new-name.ts',
		'index 5555555..6666666 100644',
		'--- a/src/old-name.ts',
		'+++ b/src/new-name.ts',
		'@@ -1 +1,2 @@',
		' export const oldName = true;',
		'+export const renamed = true;',
		'diff --git a/src/binary.bin b/src/binary.bin',
		'index 7777777..8888888 100644',
		'GIT binary patch',
		'literal 8',
		'Pc$@',
		'diff --git a/src/script.sh b/src/script.sh',
		'old mode 100644',
		'new mode 100755',
	].join('\n');

	const longLinePatch = [
		'diff --git a/src/endpoint.ts b/src/endpoint.ts',
		'--- a/src/endpoint.ts',
		'+++ b/src/endpoint.ts',
		'@@ -1 +1 @@',
		'-const endpoint = "https://api.example.com/v1";',
		'+const endpoint = "https://api.example.com/v1/workspaces/primary/projects/jolt/deployments/current/status";',
	].join('\n');

	const whitespacePatch = [
		'diff --git a/src/indent.ts b/src/indent.ts',
		'--- a/src/indent.ts',
		'+++ b/src/indent.ts',
		'@@ -1 +1 @@',
		'-const value = 1;',
		'+  const\tvalue = 2;',
	].join('\n');

	const { Story } = defineMeta({
		title: 'Data Display/Diff Viewer',
		component: DiffViewer,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
		args: {
			patch,
		},
	});

	type TemplateArgs = DiffViewerProps;
</script>

{#snippet template(args: TemplateArgs)}
	<div class="w-[54rem] max-w-full">
		<DiffViewer {...args} />
	</div>
{/snippet}

<Story name="Unified" {template} />

<Story name="Split" args={{ view: 'split' }} {template} />

<Story name="Metadata" args={{ patch: metadataPatch }} {template} />

<Story name="Whitespace" args={{ patch: whitespacePatch, showWhitespace: true }} {template} />

<Story name="Long lines" args={{ patch: longLinePatch }} {template} />

<Story name="Empty" args={{ patch: '' }} {template} />
