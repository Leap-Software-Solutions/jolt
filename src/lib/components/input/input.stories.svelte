<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './input.svelte';

	const { Story } = defineMeta({
		title: 'Forms/Input',
		component: Input,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
		},
	});
</script>

<Story name="Default" args={{ 'aria-label': 'Email address', placeholder: 'Email address' }} />

<Story name="With value" args={{ 'aria-label': 'Email address', value: 'ada@leap-online.com' }} />

<Story
	name="Disabled"
	args={{ 'aria-label': 'Email address', placeholder: 'Email address', disabled: true }}
/>

<Story
	name="Invalid"
	args={{ 'aria-label': 'Email address', placeholder: 'Email address', 'aria-invalid': 'true' }}
/>

<Story
	name="Password"
	args={{ type: 'password', 'aria-label': 'Password', placeholder: 'Password' }}
/>
