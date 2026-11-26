<script lang="ts">
	import DiffViewer from './diff-viewer.svelte';
	import type { DiffViewMode } from './types.js';

	let {
		patch,
		view = 'unified',
		showWhitespace = false,
	}: {
		patch: string;
		view?: DiffViewMode;
		showWhitespace?: boolean;
	} = $props();
</script>

<DiffViewer {patch} {view} {showWhitespace} />
