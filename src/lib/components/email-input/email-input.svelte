<script lang="ts" module>
	import type { Props as TagsInputProps } from '../tags-input/types.js';

	export type Props = Omit<TagsInputProps, 'validate' | 'normalize' | 'separators'>;
</script>

<script lang="ts">
	import { TagsInput } from '../tags-input/index.js';
	import { isEmail, normalizeEmail } from './email.js';

	let { value = $bindable([]), placeholder = 'name@company.com', ...rest }: Props = $props();
</script>

<TagsInput
	bind:value
	{placeholder}
	validate={isEmail}
	normalize={normalizeEmail}
	separators={[',', ';', ' ', '\n']}
	{...rest}
/>
