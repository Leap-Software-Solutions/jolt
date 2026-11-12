import './preview.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/svelte-vite';

const preview: Preview = {
	parameters: {
		layout: 'centered',
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'error',
		},
	},
	decorators: [
		withThemeByClassName({
			themes: {
				light: '',
				dark: 'dark',
			},
			defaultTheme: 'light',
		}),
	],
};

export default preview;
