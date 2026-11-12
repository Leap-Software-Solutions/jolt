import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
		'@storybook/addon-themes',
	],
	framework: '@storybook/svelte-vite',
	core: {
		disableTelemetry: true,
	},
};

export default config;
