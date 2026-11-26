<script lang="ts" module>
	import type { DateInput } from '../../utils/format.js';

	export type Props = {
		/** The timestamp to describe relative to the current time. */
		date: DateInput;
		class?: string;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { formatRelativeTime } from '../../utils/format.js';
	import { cls } from '../../utils/index.js';

	const absoluteFormat = new Intl.DateTimeFormat('en', {
		dateStyle: 'medium',
		timeStyle: 'short',
	});

	let { date, class: className }: Props = $props();

	let now = $state(new Date());

	onMount(() => {
		const timer = setInterval(() => {
			now = new Date();
		}, 60_000);

		return () => clearInterval(timer);
	});

	const parsedDate = $derived(date instanceof Date ? date : new Date(date));
	const isValidDate = $derived(!Number.isNaN(parsedDate.getTime()));
	const isoDate = $derived(isValidDate ? parsedDate.toISOString() : undefined);
	const absoluteLabel = $derived(isValidDate ? absoluteFormat.format(parsedDate) : 'Invalid date');
	const relativeLabel = $derived(formatRelativeTime(date, now));
</script>

<time
	data-slot="time-ago"
	datetime={isoDate}
	title={absoluteLabel}
	aria-label={absoluteLabel}
	class={cls('whitespace-nowrap', className)}
>
	{relativeLabel}
</time>
