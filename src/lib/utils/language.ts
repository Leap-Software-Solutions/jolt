const codeExtensions: Record<string, string> = {
	bash: 'bash',
	c: 'c',
	cc: 'cpp',
	conf: 'ini',
	cpp: 'cpp',
	cs: 'csharp',
	csx: 'csharp',
	css: 'css',
	cts: 'typescript',
	cxx: 'cpp',
	diff: 'diff',
	go: 'go',
	gql: 'graphql',
	graphql: 'graphql',
	h: 'c',
	hh: 'cpp',
	hpp: 'cpp',
	htm: 'xml',
	html: 'xml',
	hxx: 'cpp',
	ini: 'ini',
	java: 'java',
	js: 'javascript',
	json: 'json',
	jsonc: 'json',
	jsx: 'javascript',
	kt: 'kotlin',
	kts: 'kotlin',
	lua: 'lua',
	markdown: 'markdown',
	md: 'markdown',
	mjs: 'javascript',
	mts: 'typescript',
	patch: 'diff',
	php: 'php',
	proto: 'protobuf',
	py: 'python',
	pyw: 'python',
	rb: 'ruby',
	rs: 'rust',
	sh: 'bash',
	sql: 'sql',
	svelte: 'xml',
	swift: 'swift',
	toml: 'ini',
	ts: 'typescript',
	tsx: 'typescript',
	vue: 'xml',
	xhtml: 'xml',
	xml: 'xml',
	yaml: 'yaml',
	yml: 'yaml',
	zsh: 'bash',
};

const codeFileNames: Record<string, string> = {
	containerfile: 'dockerfile',
	dockerfile: 'dockerfile',
	gnumakefile: 'makefile',
	makefile: 'makefile',
};

function getExtension(name: string): string {
	const dot = name.lastIndexOf('.');
	return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Resolves a highlight.js language from a file name. */
export function getLanguageFromName(name: string): string | null {
	const lowerName = name.toLowerCase();
	const baseName = lowerName.split('/').pop() ?? lowerName;
	const fileNameLanguage = codeFileNames[baseName];

	if (fileNameLanguage) return fileNameLanguage;
	if (baseName.startsWith('dockerfile.') || baseName.startsWith('containerfile.')) {
		return 'dockerfile';
	}

	return codeExtensions[getExtension(lowerName)] ?? null;
}
