# Jolt — Leap design system plan

Status: active — `0.7.0` published
Package: `@leap-online/jolt`
License: MIT
Repo: `~/projects/leap/jolt`

Jolt is Leap's internal Svelte 5 component library: black-and-white foundations, a restrained gold accent, bits-ui behaviour, and combined components that avoid shadcn-svelte's parts-and-portals boilerplate.

## 1. Locked decisions

| Decision | Choice |
| --- | --- |
| Audience | Internal Leap applications |
| Distribution | Installable npm package, not a copy-in registry |
| Framework coupling | None — plain Svelte 5, no SvelteKit dependency |
| Styling | Tailwind CSS v4, design tokens in CSS |
| Behaviour primitives | bits-ui |
| Documentation | Storybook 10 for now; SvelteKit docs site later if needed |
| Dark mode | Supported from day one |
| Accent | Leap gold `#bba53d`, used sparingly |
| Font | Manrope Variable, bundled |
| Radius | 6px base |
| Source layout | Per-component family folders, not atoms/molecules/organisms |
| API surface | Combined components by default; styled primitive parts only when a real need appears |
| Token names | Unprefixed, shadcn-compatible semantic names |
| Visual regression | Not now; no Chromatic |
| CI | GitHub Actions |
| Publishing | npm via Changesets, Trusted Publishing, and provenance |

## 2. Stack

Current versions:

| Area | Package | Version |
| --- | --- | --- |
| Runtime language | Node | >= 24 |
| Package manager | pnpm | 12.16 |
| UI | Svelte | 5.57 |
| Bundler | Vite + `@sveltejs/vite-plugin-svelte` | 8.3 / 7.3 |
| Headless primitives | bits-ui | 2.20 |
| CSS | Tailwind CSS + `@tailwindcss/vite` | 4.3 |
| Variants | `tailwind-variants` | 4.0 |
| Class merging | `clsx`, `tailwind-merge` | 2.1 / 3.7 |
| Icons | `@lucide/svelte` | 1.70 |
| Font | `@fontsource-variable/manrope` | 5.3 |
| Animations | `tw-animate-css` | 1.4 |
| Packaging | `@sveltejs/package` | 3.0 |
| Storybook | `storybook` + `@storybook/svelte-vite` | 10.6 |
| Story format | `@storybook/addon-svelte-csf` | 5.1 |
| Storybook addons | docs, a11y, vitest, themes | 10.6 |
| Tests | `vitest` + `@vitest/browser-playwright` | 5.1 |
| Data table | `@tanstack/svelte-table` | 9.3 |
| Type checking | `svelte-check` | 4.7 |
| TypeScript | `typescript` | 6.0 |
| Lint / format | ESLint 10, Prettier 3.9, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` | current |
| Releases | `@changesets/cli` | 3.0 |
| Package validation | `publint`, `@arethetypeswrong/cli` | current |

TypeScript is pinned to 6.x because `svelte-check` and `typescript-eslint` peer ranges stop there.

## 3. Repository layout

Single package. Promote to a pnpm workspace only when a docs app or a second package actually exists.

```text
jolt/
├── .changeset/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .storybook/
│   ├── main.ts
│   ├── manager.ts
│   ├── preview.css
│   ├── preview.ts
│   └── vitest.setup.ts
├── src/
│   ├── docs/                    # Storybook MDX pages, not published
│   │   ├── accessibility.mdx
│   │   ├── components.mdx
│   │   ├── form-tooling.mdx
│   │   ├── installation.mdx
│   │   ├── introduction.mdx
│   │   ├── theming.mdx
│   │   └── typography.mdx
│   └── lib/
│       ├── components/
│       │   ├── button/
│       │   │   ├── button.svelte
│       │   │   ├── button.stories.svelte
│       │   │   ├── button.svelte.test.ts
│       │   │   └── index.ts
│       │   ├── dialog/
│       │   ├── combobox/
│       │   └── ...
│       ├── styles/
│       │   └── theme.css
│       ├── types/
│       │   └── index.ts
│       ├── utils/
│       │   ├── clipboard.ts
│       │   ├── cls.ts
│       │   ├── highlight.ts
│       │   └── index.ts
│       └── index.ts             # root barrel
├── tests/
│   └── consumer/                # packed-tarball smoke test
├── AGENTS.md
├── LICENSE
├── README.md
├── THIRD_PARTY_NOTICES.md
├── eslint.config.js
├── package.json
├── prettier.config.js
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

Shared types (`WithElementRef`, item unions used by more than one component) live in `src/lib/types/`. Component-local `Props` types stay in the component's module script, matching the Svelte/shadcn pattern.

`.gitignore` covers `node_modules`, `dist`, `storybook-static`, `coverage`, `.env`, and editor/OS files.

## 4. Package configuration

```json
{
	"name": "@leap-online/jolt",
	"version": "0.7.0",
	"license": "MIT",
	"type": "module",
	"engines": { "node": ">=24" },
	"packageManager": "pnpm@12.16.1",
	"sideEffects": ["**/*.css"],
	"files": [
		"dist",
		"!dist/**/*.stories.*",
		"!dist/**/*.test.*",
		"!dist/**/*.spec.*",
		"THIRD_PARTY_NOTICES.md"
	],
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js",
			"default": "./dist/index.js"
		},
		"./styles.css": "./dist/styles/theme.css",
		"./package.json": "./package.json"
	},
	"scripts": {
		"dev": "storybook dev -p 6006 --no-open",
		"build": "svelte-package",
		"check": "svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write .",
		"test": "vitest run",
		"test:unit": "vitest run --project=unit",
		"test:components": "vitest run --project=components",
		"test:storybook": "vitest run --project=storybook",
		"storybook": "storybook dev -p 6006 --no-open",
		"storybook:build": "storybook build",
		"package": "svelte-package && publint",
		"package:types": "attw --pack .",
		"test:consumer": "pnpm build && node tests/consumer/verify.mjs",
		"changeset": "changeset"
	}
}
```

Peer dependencies:

```json
{
	"peerDependencies": {
		"bits-ui": "^2.20.0",
		"svelte": "^5.33.0",
		"tailwindcss": "^4.0.0"
	}
}
```

Runtime dependencies: `@fontsource-variable/manrope`, `@internationalized/date`, `@lucide/svelte`, `@tanstack/svelte-table`, `clsx`, `highlight.js`, `marked`, `sanitize-html`, `svelte-sonner`, `tailwind-merge`, `tailwind-variants`, `tw-animate-css`, and `valibot`.

`bits-ui` is a peer because version alignment matters and consumers may already use it. `tailwindcss` is a peer because Jolt is useless without Tailwind v4. Date, table, markdown, clipboard, and validation dependencies are owned by Jolt so consumer apps do not have to assemble the same stack.

Root barrel only for now. Add per-family subpath exports if import-graph size or build times become a problem.

### Tooling configuration

- `vite.config.ts`: `plugins: [tailwindcss(), svelte()]` from `@tailwindcss/vite` and `@sveltejs/vite-plugin-svelte`. Storybook's Vite builder reuses this config; no duplicate Storybook Vite setup.
- Use relative imports inside `src/lib`; do not rely on the SvelteKit `$lib` alias, because the package is intentionally Kit-free. Stories, tests, and MDX pages use relative imports too.
- `svelte.config.js`: `vitePreprocess()` from `@sveltejs/vite-plugin-svelte`.
- `tsconfig.json`: `strict`, `moduleResolution: "bundler"`, `verbatimModuleSyntax`, `isolatedModules`, `skipLibCheck`, `allowJs: false`.
- `eslint.config.js`: flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`, `eslint-plugin-storybook`, `eslint-config-prettier`, and `includeIgnoreFile` for `.gitignore`.
- `prettier.config.js`: tabs, single quotes, trailing commas, 100 columns, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` with `tailwindStylesheet: './.storybook/preview.css'`.
- `pnpm-workspace.yaml`: allows the `esbuild` build script and temporarily sets `minimumReleaseAge: 0` so today's releases can be installed. Revisit the age gate once the dependency set settles.

## 5. CSS distribution

Tailwind v4 ignores `node_modules` when scanning class names, so the library ships a CSS entrypoint that registers its own sources:

```css
/* consumer app.css */
@import 'tailwindcss';
@import '@leap-online/jolt/styles.css';
```

`src/lib/styles/theme.css` becomes `dist/styles/theme.css`. It contains, in order:

1. Font import: `@import '@fontsource-variable/manrope/index.css';`
2. Animation utilities: `@import 'tw-animate-css';`
3. Source registration: `@source '../';` — resolves to `src/lib` in development and `dist` in the published package.
4. `@custom-variant dark (&:where(.dark, .dark *));`
5. `@theme` blocks for scales, fonts, and radii.
6. `@theme inline` mappings from semantic CSS variables to Tailwind color utilities.
7. `:root` and `.dark` semantic token values.
8. A minimal base layer: default border colour, `::selection`, reduced-motion handling.

The library CSS **must not** import `tailwindcss` itself; the consumer owns that import and order.

`sideEffects: ["**/*.css"]` keeps CSS imports alive in consumer bundlers. `"svelte"` and `"types"` export conditions keep the package usable by Vite and TypeScript.

## 6. Theme

### Palette

The site's neutral scale is reused, with a generated gold scale anchored on the site's exact accent. Implement colours in OKLCH. Raw palette scales are namespaced (`leap-gray`, `gold`) so importing Jolt does not overwrite Tailwind's built-in `gray` scale in a consuming app; semantic tokens stay unprefixed.

```css
@theme {
	/* Leap neutral scale */
	--color-leap-gray-50: oklch(98.21% 0 0);
	--color-leap-gray-100: oklch(96.72% 0 0);
	--color-leap-gray-200: oklch(94.01% 0 0);
	--color-leap-gray-300: oklch(90.32% 0.0017 247.84);
	--color-leap-gray-400: oklch(75.88% 0.0023 17.21);
	--color-leap-gray-500: oklch(62.83% 0.0149 241.09);
	--color-leap-gray-600: oklch(55.10% 0.0234 264.36);
	--color-leap-gray-700: oklch(42.67% 0.0444 289.46);
	--color-leap-gray-800: oklch(33.40% 0.0112 248.16);
	--color-leap-gray-900: oklch(24.78% 0 0);
	--color-leap-gray-950: oklch(18.70% 0.0361 290.10);

	/* Leap gold scale */
	--color-gold-50: oklch(97.50% 0.035 97.16);
	--color-gold-100: oklch(94.80% 0.060 97.16);
	--color-gold-200: oklch(90.50% 0.090 97.16);
	--color-gold-300: oklch(85.00% 0.115 97.16);
	--color-gold-400: oklch(78.50% 0.125 97.16);
	--color-gold-500: oklch(72.18% 0.1244 97.16);
	--color-gold-600: oklch(66.50% 0.120 97.16);
	--color-gold-700: oklch(57.66% 0.1141 95.56);
	--color-gold-800: oklch(50.00% 0.100 97.16);
	--color-gold-900: oklch(43.00% 0.080 97.16);
	--color-gold-950: oklch(33.00% 0.055 97.16);
}
```

### Semantic tokens

```css
:root {
	--background: oklch(100% 0 0);                    /* #ffffff */
	--foreground: oklch(18.70% 0.0361 290.10);        /* #131022 */
	--card: oklch(100% 0 0);
	--card-foreground: oklch(18.70% 0.0361 290.10);
	--popover: oklch(100% 0 0);
	--popover-foreground: oklch(18.70% 0.0361 290.10);
	--primary: oklch(18.70% 0.0361 290.10);
	--primary-foreground: oklch(100% 0 0);
	--secondary: oklch(96.72% 0 0);                  /* #f4f4f4 */
	--secondary-foreground: oklch(18.70% 0.0361 290.10);
	--muted: oklch(96.72% 0 0);
	--muted-foreground: oklch(54% 0.0234 264.36); /* #686f7d, 4.59:1 on muted */
	--accent: oklch(96.72% 0 0);
	--accent-foreground: oklch(18.70% 0.0361 290.10);
	--destructive: oklch(50.03% 0.1821 29.51);       /* #b42318 */
	--destructive-foreground: oklch(100% 0 0);
	--success: oklch(48% 0.14 150);
	--success-foreground: oklch(100% 0 0);
	--info: oklch(48.8% 0.217 264.376);
	--info-foreground: oklch(100% 0 0);
	--warning: oklch(51% 0.145 49);
	--warning-foreground: oklch(100% 0 0);
	--border: oklch(94.01% 0 0);                     /* #ebebeb */
	--input: oklch(90.32% 0.0017 247.84);            /* #dedfe0 */
	--ring: oklch(57.66% 0.1141 95.56);              /* #8e7810 */
	--brand: oklch(72.18% 0.1244 97.16);             /* #bba53d */
	--brand-foreground: oklch(18.70% 0.0361 290.10);
	--brand-strong: oklch(48% 0.12 95.56);             /* #725b00 */
	--brand-subtle: oklch(96.50% 0.028 97.16);       /* #f8f4df */
	--chart-1: var(--brand);
	--chart-2: oklch(18.70% 0.0361 290.10);
	--chart-3: var(--brand-strong);
	--chart-4: oklch(75.88% 0.0023 17.21);
	--chart-5: oklch(42.67% 0.0444 289.46);
}

.dark {
	--background: oklch(14.52% 0.0021 286.13);       /* #0a0a0b */
	--foreground: oklch(98.51% 0 0);                 /* #fafafa */
	--card: oklch(18.31% 0.0040 285.99);             /* #121214 */
	--card-foreground: oklch(98.51% 0 0);
	--popover: oklch(18.31% 0.0040 285.99);
	--popover-foreground: oklch(98.51% 0 0);
	--primary: oklch(98.51% 0 0);
	--primary-foreground: oklch(14.52% 0.0021 286.13);
	--secondary: oklch(30% 0.005 286.08);            /* #2d2d30 */
	--secondary-foreground: oklch(98.51% 0 0);
	--muted: oklch(21.86% 0.0039 286.08);
	--muted-foreground: oklch(71.18% 0.0129 286.07); /* #a1a1aa */
	--accent: oklch(24.05% 0.0057 285.97);           /* #1f1f22 */
	--accent-foreground: oklch(98.51% 0 0);
	--destructive: oklch(71.06% 0.1661 22.22);       /* #f87171 */
	--destructive-foreground: oklch(14.52% 0.0021 286.13);
	--success: oklch(70% 0.15 150);
	--success-foreground: oklch(14.52% 0.0021 286.13);
	--info: oklch(80.9% 0.105 251.813);
	--info-foreground: oklch(14.52% 0.0021 286.13);
	--warning: oklch(87.9% 0.169 91.605);
	--warning-foreground: oklch(14.52% 0.0021 286.13);
	--border: oklch(27.02% 0.0073 285.90);           /* #26262a */
	--input: oklch(32.39% 0.0123 285.69);            /* #33333a */
	--ring: oklch(72.18% 0.1244 97.16);              /* #bba53d */
	--brand: oklch(72.18% 0.1244 97.16);
	--brand-foreground: oklch(18.70% 0.0361 290.10);
	--brand-strong: oklch(79.63% 0.1212 95.73);      /* #d4bc5a */
	--brand-subtle: oklch(30% 0.03 97.16);           /* #322e1c */
	--chart-1: var(--brand);
	--chart-2: oklch(98.51% 0 0);
	--chart-3: var(--brand-strong);
	--chart-4: oklch(62.83% 0.0149 241.09);
	--chart-5: oklch(71.18% 0.0129 286.07);
}
```

`@theme inline` maps each semantic variable to a Tailwind utility: `--color-background: var(--background)`, `--color-brand: var(--brand)`, and so on. `inline` is required so dark-mode value changes are picked up at runtime.

### Gold usage rules

Contrast is the constraint, not taste:

| Foreground | Background | Ratio | Allowed use |
| --- | --- | --- | --- |
| `#bba53d` brand | white | 2.45:1 | Decorative fills, borders, large graphics only |
| `#725b00` brand-strong | white | 6.54:1 | Text, icons, UI boundaries |
| `#8e7810` focus ring | white | 4.34:1 | Focus rings and UI boundaries |
| `#bba53d` brand | `#131022` | 7.61:1 | Text, icons, focus ring |
| `#131022` foreground | `#bba53d` fill | 8.56:1 | Text on gold buttons/badges |
| `#d4bc5a` brand-strong | `#0a0a0b` | 10.5:1 | Text on dark surfaces |

Rules:

- Default CTAs are black (light) / white (dark). Gold is an accent, not the primary action colour.
- Use gold for focus rings, selected/active indicators, active navigation markers, small status badges, chart series 1, and text selection.
- In light mode, never use `text-brand` for body text — use `text-brand-strong`.
- Gold fills always pair with `text-brand-foreground` (near-black).
- Verify every new gold usage against the contrast table; do not introduce gold-on-white body text.

### Radius and typography

```css
@theme inline {
	--radius-sm: 0.25rem;   /* 4px */
	--radius-md: 0.375rem;  /* 6px */
	--radius-lg: 0.5rem;    /* 8px */
	--radius-xl: 0.75rem;   /* 12px */
}

@theme {
	--font-sans: 'Manrope Variable', ui-sans-serif, system-ui, sans-serif;
	--font-heading: 'Manrope Variable', ui-sans-serif, system-ui, sans-serif;
	--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

Headings use Manrope at 700/800 with tight tracking. Do not override Tailwind's type scale until the Foundations page has a documented reason.

### Base layer

Minimal global styling only:

- default border colour from `--border`;
- `::selection` with gold at low opacity;
- `prefers-reduced-motion` disables non-essential animation;
- no global `body` background or typography — consumers set `bg-background text-foreground` on `<body>`.

## 7. Component conventions

### Files and exports

- Kebab-case files, one folder per public component family.
- `index.ts` re-exports the default as a PascalCase named export plus variants and types.
- Internal subcomponents that should not be public stay in the same folder and are not exported.
- Shared types go in `src/lib/types/`; component-local `Props` stays in the component module.

```ts
// src/lib/components/button/index.ts
export {
	default as Button,
	buttonVariants,
	type Props as ButtonProps,
	type ButtonVariant,
	type ButtonSize,
} from './button.svelte';
```

### Svelte and props

- Svelte 5 runes only: `$props`, `$state`, `$derived`, `$bindable`, snippets.
- `const { class: className, ...rest }: Props = $props();`
- Bindable state: `let { open = $bindable(false), value = $bindable() }: Props = $props();`
- `data-slot="..."` on styled elements for testing and styling hooks.
- Spread `...rest` onto the root element where it is safe.
- Icons from `@lucide/svelte`, imported as named PascalCase components.
- Logical spacing utilities (`ms-`, `me-`, `start-`, `end-`) for direction-sensitive layout.

### Variants and classes

- `tailwind-variants` (`tv`, `VariantProps`) for components with meaningful variants. This is a deliberate deviation from the guide's hand-rolled example because slots and compound variants earn their keep.
- `cls()` from `src/lib/utils/cls.ts` for one-off class merging: `twMerge(clsx(inputs))`.
- `class` prop for the root; per-part props only where needed (`triggerClass`, `contentClass`, `itemClass`). Avoid a single nested `classes` object.
- Never hardcode colour values in components; use semantic tokens.

### Types

```ts
// src/lib/types/index.ts
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
```

No `any`. No nested ternaries. Explicit return types on exported functions.

### Combined component rules

Atomic-design folders (atoms/molecules/organisms) were considered and rejected. The boundaries are unstable, combined components hide their internals, and the project guide already uses per-component family folders. Purpose-based grouping lives in Storybook navigation, not in the source tree.

1. One import, one element for the common case.
2. The component owns `Portal`, `Content`, `Trigger`, and focus management internally.
3. State is controlled with `bind:open`, `bind:value`.
4. Content is customised with snippets, not exported parts.
5. Lists are typed item arrays with a snippet override for custom rendering.
6. Behaviour comes from bits-ui; do not hand-roll keyboard navigation.
7. Styling escape hatches are class props and `...rest`; structural escape hatches are added only when a real use case demands them.
8. Structural composition is reserved for layout/content shells (Card, Sidebar, AppShell).

Snippet names are consistent across components:

| Snippet | Purpose |
| --- | --- |
| `trigger` | Render the trigger element with provided props |
| `item` | Render one item in a list, menu, or combobox |
| `selected` | Render the selected value in a trigger |
| `empty` | Render the empty state |
| `header` / `footer` | Render content sections |
| `children` | Render the default body or panel content |
| `content` | Render a tab or accordion item body |

Examples:

```svelte
<Tooltip text="Delete asset">
	{#snippet trigger(props)}
		<Button {...props} size="icon" variant="ghost" aria-label="Delete"><Trash /></Button>
	{/snippet}
</Tooltip>
```

```svelte
<Dialog bind:open title="Delete asset" description="This cannot be undone.">
	<p>...</p>
	{#snippet footer()}
		<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
		<Button variant="destructive" onclick={remove}>Delete</Button>
	{/snippet}
</Dialog>
```

```svelte
<Select {items} bind:value placeholder="Status" />

<Combobox
	items={engineers}
	bind:value
	getKey={(engineer) => engineer.id}
	getLabel={(engineer) => engineer.name}
	placeholder="Assign engineer"
	onSearch={searchEngineers}
/>
```

```svelte
<DropdownMenu
	items={[
		{ label: 'Edit', icon: Pencil, onSelect: edit },
		{ type: 'separator' },
		{ label: 'Delete', icon: Trash, variant: 'destructive', onSelect: remove },
	]}
>
	{#snippet trigger(props)}
		<Button {...props} size="icon" variant="ghost" aria-label="More actions"><MoreHorizontal /></Button>
	{/snippet}
</DropdownMenu>
```

```svelte
<TextField label="Email" type="email" bind:value error={errors.email?.[0]} />
<SelectField label="Status" {items} bind:value />
```

### Item and type shapes

- `Select<T>`: `{ value: T; label: string; disabled?: boolean }[]`.
- `Combobox<T>`: user data array plus `getKey`, `getLabel`, optional `onSearch`, `loading`, `empty` snippet.
- `DropdownMenu`: discriminated union over `item`, `separator`, `group`, `submenu`, `checkbox`, `radio`.
- `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`: typed item/config arrays with snippet overrides.

Generic components use Svelte 5 `<script lang="ts" generics="T">` and export `Props<T>`. Validate generic inference in stories and the consumer fixture before rolling it out widely.

### Component-specific notes

- **Tooltip**: bits-ui requires a `Tooltip.Provider` ancestor. The combined `<Tooltip>` renders its own provider internally so one import works; expose `delay` and `disableHoverableContent`. Add a shared `TooltipGroup` provider later only if delay grouping is needed.
- **Dialog**: require `title`, render `Title` and `Description` internally from props. Omit `aria-describedby` when no description is provided.
- **Combobox**: debounce `onSearch` internally (default ~200ms), expose `loading` and `empty`, and use `getKey` for identity rather than object equality.
- **DropdownMenu**: use a discriminated union for items; default items omit `type` and are treated as `'item'`.
- **Field wrappers**: own label association, hint text, error text, `aria-invalid`, and `aria-describedby`.

## 8. Component roadmap

| Wave | Components | Status and notes |
| --- | --- | --- |
| 1. Vertical slice | Button, Tooltip, Dialog, Input, Label, Badge, Separator | Complete; proves combined API, theme, Storybook, packaging |
| 2. Pattern setters | Select, Combobox, DropdownMenu, Tabs, Card, Alert, Avatar, Checkbox, Switch, Skeleton | Complete; establishes list/item/snippet conventions |
| 3. Forms and navigation | Textarea, RadioGroup, Slider, ToggleGroup, Accordion, Popover, Collapsible, Pagination, Breadcrumb, Progress, TextField/SelectField/CheckboxField | Complete; field wrappers reduce form boilerplate |
| 4. Data and advanced | Sheet, DatePicker, DateRangePicker, Toast, Command palette, DataTable, ScrollArea | Complete; TanStack table and toast integration |
| 5. Patterns and app chrome | ConfirmDialog, EmptyState, PageHeader, ContextMenu, HoverCard, MultiSelect, NavigationMenu, Menubar, Sidebar, AppShell | Complete; composed patterns and application layout |
| 6. Chat and LLM | Spinner, Kbd, AvatarGroup, FileUpload, CodeBlock, Chat, ChatViewport, ChatMessage, ChatComposer, ChatMarkdown, ChatToolCall, ChatReasoning, ChatSources, ChatSuggestions, ChatAttachments | Complete; Markdown sanitisation and code highlighting included |
| 7. Published increments | TagsInput, EmailInput, CopyButton, SplitButton, TreeView, Lightbox, InlineEdit, ReactionBar | Complete; published through `0.5.1` |
| 8. Consumer data foundations | Formatting utilities, TimeAgo, DescriptionList, FeedItem, Badge status tones and counts, SeverityDot | Complete; published in `0.6.0` |
| 9. Review and runtime | DataTable virtualization/selection/states, CodeBlock extensions, diff parser and DiffViewer, Stepper, ApprovalBar, ChatApprovalRequest, CommentThread | Complete; published in `0.7.0` |
| 10. Later | Charts, blocks/templates, InputOTP, Timeline, MetricTile, FilterBar, UserChip, MentionInput, GridLayout | UserChip complete and awaiting release; evaluate the rest when a concrete consumer surface needs them |

Combined by default: Button, Toggle, Input, Textarea, Checkbox, Switch, Select, Combobox, MultiSelect, Tooltip, Dialog, Sheet, Popover, DropdownMenu, ContextMenu, Menubar, HoverCard, Tabs, Accordion, Pagination, Breadcrumb, Alert, Avatar, Calendar, DatePicker, TimePicker, Toast, Fields, ConfirmDialog, EmptyState, PageHeader, TimeAgo, DescriptionList, FeedItem, SeverityDot, Stepper, ApprovalBar, CommentThread.

Structural exceptions: Card (content container with header/footer snippets), Sidebar/AppShell (layout), DiffViewer (large content shell), MetricTile (sparkline and action snippets), Chart containers.

## 9. Storybook

- Framework: `@storybook/svelte-vite` (no SvelteKit).
- Addons: `@storybook/addon-svelte-csf`, `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-vitest`, `@storybook/addon-themes`.
- `.storybook/main.ts` story globs: `../src/**/*.mdx`, `../src/**/*.stories.@(ts|svelte)`.
- `.storybook/preview.css` imports `tailwindcss` and `../src/lib/styles/theme.css`, plus Storybook-only helpers.
- `withThemeByClassName` toggles `.dark` on `<html>`; stories are checked in both themes.
- `.storybook/manager.ts` themes the Storybook shell in black with gold accents via `storybook/theming` and `storybook/manager-api`.
- `core.disableTelemetry: true`.
- A11y: `error` from the start; stories must pass axe before merging.

Storybook navigation is purpose-based, not atomic:

```text
Foundations/   Introduction, Installation, Theming, Typography, Component guidelines, Accessibility
Actions/       Button, Toggle, ToggleGroup
Forms/         Input, TextField, Select, Combobox, MultiSelect, Checkbox, Switch, Slider, Calendar, DatePicker, DateRangePicker, TimePicker
Data Display/  Card, DataTable, Table, Badge, Avatar, TimeAgo, DescriptionList, FeedItem, SeverityDot, CodeBlock, Markdown, DiffViewer, Stepper
Feedback/      Alert, Progress, Skeleton, Toast
Navigation/    NavigationMenu, Menubar, Tabs, Breadcrumb, Pagination
Layout/        AppShell, Accordion, Collapsible, ScrollArea, Separator, Sidebar
Overlays/      Dialog, Sheet, Popover, Tooltip, DropdownMenu, CommandPalette, ContextMenu, HoverCard
Patterns/      Form tooling, ConfirmDialog, EmptyState, PageHeader
```

Stories are co-located `*.stories.svelte` files using `defineMeta` and `tags: ['autodocs']`. Each component gets:

- a default story;
- every variant and size;
- disabled, loading, error, and empty states where relevant;
- light and dark checks;
- `play` functions for keyboard and overlay behaviour.

MDX docs pages cover Introduction, Installation, Theming, Typography, Accessibility, Component guidelines, and Form tooling. Component API tables come from autodocs.

## 10. Testing and package validation

Vitest projects:

1. `unit` — Node environment, pure logic: `cls`, variant functions, item normalisation, formatters.
2. `components` — browser mode, direct `*.svelte.test.ts` component tests for behaviour that is awkward to express as a story.
3. `storybook` — browser mode via `@storybook/addon-vitest` and Playwright Chromium; every story is a render test, a11y runs alongside.

```ts
// vitest.config.ts (shape)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			projects: [
				{
					extends: true,
					test: {
						name: 'unit',
						environment: 'node',
						include: ['src/**/*.test.ts'],
						exclude: ['src/**/*.svelte.test.ts'],
					},
				},
				{
					extends: true,
					test: {
						name: 'components',
						browser: {
							enabled: true,
							provider: playwright({}),
							headless: true,
							instances: [{ browser: 'chromium' }],
						},
						include: ['src/**/*.svelte.test.ts'],
					},
				},
				{
					extends: true,
					plugins: [
						storybookTest({
							configDir: path.join(dirname, '.storybook'),
							storybookScript: 'pnpm storybook',
						}),
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							provider: playwright({}),
							headless: true,
							instances: [{ browser: 'chromium' }],
						},
					},
				},
			],
		},
	}),
);
```

`.storybook/vitest.setup.ts` calls `setProjectAnnotations` with the a11y annotations and preview annotations from `@storybook/svelte-vite`.

Package validation:

- `svelte-package` build;
- `publint` for export map and file correctness — hard CI gate;
- `attw --pack .` as an advisory local check — Svelte-only export conditions can produce expected warnings, so it does not block CI initially;
- `pnpm pack` into a temp consumer app that imports components and `@leap-online/jolt/styles.css`, builds with Vite, and asserts that a known component utility class is present in the output CSS.

The packed-tarball consumer fixture remains a release gate alongside `publint`.

A11y requirements:

- icon-only buttons require a `label` prop rendered as `aria-label`;
- form fields associate labels, errors, and `aria-invalid`;
- overlays rely on bits-ui focus management;
- focus-visible rings are always visible in both themes;
- reduced motion respected;
- no a11y violations in story tests.

Visual regression is deferred. If needed later, use Playwright screenshots rather than Chromatic.

## 11. GitHub Actions and releases

CI lives in `.github/workflows/ci.yml` and runs on pull requests and pushes to `main`:

- **Verify:** install with the frozen lockfile, build, run `svelte-check`, lint, and check for changesets on pull requests.
- **Test and package:** install Playwright Chromium, run unit/component/story tests, build the package with `publint`, build Storybook, and run the packed-tarball consumer fixture on `main`.

The release workflow lives in `.github/workflows/release.yml` and runs on `v*` tags:

- `contents: write` for the GitHub Release and `id-token: write` for npm Trusted Publishing;
- install, build, and package;
- publish with npm provenance through OIDC when the version is not already on npm;
- create a GitHub Release with generated notes when one does not already exist.

The package was bootstrapped by publishing `0.5.1` manually. Trusted Publishing is configured for the GitHub repository and `release.yml`; later releases use OIDC and do not need a long-lived npm token. A tag run is idempotent: if npm already has the version, it skips publishing and only creates the GitHub Release.

Release flow:

1. Add a changeset with each user-facing change.
2. Before release: `pnpm changeset version`, commit the version bump and changelog.
3. `git tag vX.Y.Z` and push the tag.
4. The release workflow publishes to npm and creates the GitHub Release.

Pre-1.0, breaking changes may ship as minor bumps; document them in the changelog. Strict semver after 1.0.

## 12. Milestones

### M0 — Scaffold and vertical slice

- pnpm package, TypeScript, ESLint/Prettier, changesets, LICENSE, README, third-party notices.
- Theme CSS complete: scales, semantic tokens, dark mode, Manrope, radius, base layer.
- Storybook running with manager theme, theme toggle, docs/a11y/vitest/themes addons.
- Button, Tooltip, Dialog, Input, Label, Badge, Separator.
- Consumer fixture proves the packed tarball and CSS entrypoint work.

Done when `pnpm build`, `pnpm check`, `pnpm lint`, `pnpm test`, and `pnpm package` pass, and the consumer fixture builds with styles applied.

### M1 — Pattern-setting components

- Select, Combobox, DropdownMenu, Tabs, Card, Alert, Avatar, Checkbox, Switch, Skeleton.
- Combined API conventions reviewed and documented in Storybook.
- Generic components verified in stories and the consumer fixture.
- A11y remains `error` for all stories.

### M2 — 0.1.0

- Textarea, RadioGroup, Slider, ToggleGroup, Accordion, Popover, Collapsible, Pagination, Breadcrumb, Progress, field wrappers.
- Foundations and guidelines MDX pages.
- CI and changesets flow in place.
- `0.1.0` tag; `pnpm pack` artifact; npm publishing followed in a later milestone.

### M3 — Data and integration

- Sheet, DatePicker, DateRangePicker, Toast, Command palette, DataTable, ScrollArea.
- Form integration with superforms/valibot if a consumer needs it.
- Integrate into the first real Leap app and fix what integration exposes.

### M4 — Publishing and scale (done)

- Public npm package, Trusted Publishing, provenance, and GitHub Releases.
- GitHub Actions CI and release workflows.
- Sidebar/AppShell and the published component set through `0.5.1`.
- SvelteKit docs site and visual regression remain deferred.

### M5 — Consumer-driven additions

- `0.6.0` complete: formatting utilities, TimeAgo, DescriptionList, FeedItem, Badge status tones and counts, SeverityDot.
- `0.7.0` complete: DataTable virtualization, selection, and states; CodeBlock extensions; diff parsing and DiffViewer; Stepper; ApprovalBar; ChatApprovalRequest; CommentThread.
- Later: charts, layout blocks, Timeline, MetricTile, FilterBar, UserChip, MentionInput, and GridLayout, evaluated against concrete consumer surfaces.

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Tailwind `@source` does not resolve from the installed package | Consumer fixture with `pnpm pack` is a required gate from M0 |
| Generic Svelte components infer poorly at call sites | Build Combobox/Select first; test in stories and plain consumer app |
| Combined components become prop-heavy | Prefer typed item arrays and snippets; no boolean explosion; review API per component |
| Unprefixed tokens collide with an app's existing shadcn theme | Jolt owns the theme in consuming apps; document that importing Jolt styles replaces semantic values. Raw scales are namespaced (`leap-gray`, `gold`) to limit the damage |
| Gold fails contrast | Enforce the contrast table; `brand-strong` for text in light mode; a11y tests |
| bits-ui version drift | Peer dependency; pin a compatible range; test upgrades deliberately |
| Storybook Svelte CSF addon is community-maintained | Keep story files simple; fall back to CSF if the addon breaks |
| Playwright browser installs slow/flaky in CI | Cache pnpm and install Chromium with `--with-deps`; keep browser jobs isolated |
| npm registry propagation delays the release guard | The release workflow is idempotent; rerun the tag workflow if the version check raced propagation |
| Trusted Publishing misconfiguration blocks a release | Keep the workflow filename stable, test with a patch release, and fall back to a manually authenticated publish only with explicit approval |
| Consumer-specific vocabulary leaks into the library | Enforce the intake rules in `AGENTS.md`; components receive data, labels, and callbacks rather than product concepts |
| Vendored shadcn-svelte code accumulates stale patterns | Vendor once, restyle, then own the code; no periodic re-copy. Keep the MIT notice in `THIRD_PARTY_NOTICES.md` |

## 14. Definition of done for a component

- Combined API with typed props, bindable state, and `class`/`*Class` passthrough.
- Light and dark verified.
- Keyboard, focus, and a11y verified.
- Stories for default, variants, sizes, states, and edge cases, with `play` tests for interaction.
- Exported from the family barrel with `Props` and variant types.
- No `any`, no nested ternaries, no hardcoded colours.
- `pnpm check`, `pnpm lint`, and `pnpm test` pass.
- If it adds a new public type shape, documented in the Storybook guidelines page.

## 15. Deferred and out of scope

- SvelteKit documentation site.
- Copy-in shadcn registry distribution.
- Chromatic and visual regression.
- Charts, blocks, templates, and full page patterns are consumer-driven; evaluate them when a concrete surface needs them.
- Timeline, MetricTile, FilterBar, UserChip, MentionInput, and GridLayout are candidates, not commitments.
- i18n inside components; labels remain props/snippets.
- RTL testing; logical properties are used from the start.
- Storybook logo/brand image; add when an asset exists.

## 16. References

- Leap site tokens and typography: `leap-online.com` (`--sl-primary: #bba53d`, Manrope, 4/6/8px radii).
- shadcn-svelte (MIT) for component structure and semantic token conventions.
- bits-ui for headless behaviour primitives.
- Svelte 5 runes and snippet documentation.
- Tailwind CSS v4 `@source`, `@theme`, and `@custom-variant` documentation.
- Storybook 10 Svelte/Vite, addon-svelte-csf, addon-vitest, and addon-a11y documentation.
- Velocity's combined `Select` and `Combobox` as API inspiration; implementation is rebuilt on bits-ui.
