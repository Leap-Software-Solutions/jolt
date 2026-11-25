# Jolt

Leap's Svelte 5 component library. Black-and-white foundations with a restrained gold accent, built on [bits-ui](https://bits-ui.com) and [Tailwind CSS v4](https://tailwindcss.com).

## Development

Requires Node 24+ and pnpm.

```sh
pnpm install
pnpm storybook
```

Useful commands:

```sh
pnpm check          # svelte-check
pnpm lint           # Prettier + ESLint
pnpm test           # unit, component, and story tests
pnpm build          # svelte-package
pnpm package        # build + publint
pnpm test:consumer  # packed-tarball consumer smoke test
```

## Usage

```sh
pnpm add @leap-online/jolt
```

Import the theme after Tailwind in your application CSS:

```css
@import 'tailwindcss';
@import '@leap-online/jolt/styles.css';
```

Then import components from the package root:

```svelte
<script lang="ts">
	import { Button } from '@leap-online/jolt';
</script>

<Button>Continue</Button>
```

Set `bg-background text-foreground` on `<body>` and toggle `dark` on `<html>` for dark mode.

## License

MIT.
