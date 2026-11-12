import { addons } from 'storybook/manager-api';
import { joltTheme } from './theme.js';

addons.setConfig({
	theme: joltTheme,
});
