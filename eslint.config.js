import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['tests/consumer/app/**'],
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'import-x': importX,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'import-x/first': 'error',
			// `prefer-inline` is omitted: import-x emits invalid syntax when it
			// merges a default import with a top-level type import.
			'import-x/no-duplicates': 'error',
			'no-undef': 'off',
			'simple-import-sort/exports': 'error',
			'simple-import-sort/imports': [
				'error',
				{
					// One contiguous block, ordered logically: side effects, $env/$lib
					// aliases, bare packages, other sources, then relative imports —
					// ASCII within each section. Regexes in a single group define the
					// sub-ordering without inserting blank lines between sections.
					groups: [['^\\u0000', '^\\$', '^@?\\w', '^', '^\\.']],
				},
			],
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
	},
	{
		files: ['**/*.stories.@(js|jsx|ts|tsx|svelte)'],
		plugins: {
			storybook,
		},
		rules: {
			...storybook.configs.recommended.rules,
		},
	},
);
