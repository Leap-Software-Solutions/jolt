# @leap-online/jolt

## 0.6.0

### Minor Changes

- 354fbe6294ebcbb19bdb06cd0a3498f7629a586a: Add compact count badges with configurable overflow.
- 7a54c500f015afe466ee96db0d8d1f0377469878: Add semantic badge tones and a decorative status dot.
- 8f1b92bf4021744c408e8984ff9dbabe7c6c7e95: Add a description list for label/value metadata with copy controls, layouts, and loading rows.
- df3c2c3da56e4ab31c246176ffc9e9da43204791: Add a compact feed item with leading and trailing content, unread state, and accessible row activation.
- a746d10f4f07570bd6a027cd2432e0ac29e0ae95: Add formatting utilities for relative time, durations, byte sizes, and numbers.
- 8c793bcefe3082da6068f07f9087baa3deed6ddc: Add a compact severity indicator with distinct glyphs, semantic tones, and an optional visible label.
- f5113d78d508b6eab5821de7094cfcfddf5888a9: Add a passive time-ago component with absolute timestamp fallbacks.

## 0.5.1

### Patch Changes

- b0f518dda22fe97d5d62bffb442dd92a239032b5: Rename the package to `@leap-online/jolt`, add public package metadata, and move CI and releases to GitHub Actions with npm trusted publishing.

## 0.5.0

### Minor Changes

- 4446d5bba2dda3948a04980f4785e36791291e65: Add presence statuses to `Avatar` and `AvatarGroupItem`: `online`, `away`, `busy`, and `offline`. Each status renders an accessible dot with a default or custom label. Add the semantic `success` and `success-foreground` colour tokens used by the online state.
- 0d1e02b6238f301a2439161bfa7fe82d562d7773: Add `CopyButton` for copying strings with success, failure, and unavailable-clipboard states. It announces results to screen readers, supports labelled or icon-only presentations, and uses the shared async clipboard helper.
- cd617aa44dcd42eaa8a84598471ed8f7fddb508a: Allow `Combobox` to create values from typed text. Set `creatable` and provide `createItem` to turn the current query into a value; a create row appears when the query does not match an existing label. Created values keep their label selected even before they are added to the supplied item list.
- a423af2909a99c5a1b3d8dface8f697aca651a9e: Add `EmailInput`, a `TagsInput` preset for inviting multiple addresses. It splits pasted lists on separators and whitespace, validates and normalises addresses, and ignores duplicates.
- a3ee69dc68f6772edf14056eeb7fc605a153c13b: Add `InlineEdit` for editing a single string in place. It supports single-line and multiline fields, click-to-edit and controlled editing, keyboard save and cancel, required placeholders for empty values, and a synchronous commit callback.
- 667258d1d01ce9b1fccb1f7b0f3110a76532d2f1: Add `ReactionBar` for displaying a supplied set of emoji reactions. Each reaction is an accessible toggle with a count and active state, and the component emits an updated array with optimistic count changes.
- 2d6b0a0587038db4977bd9a2d438dd8c44035506: Add `TagsInput` for arbitrary string tags with keyboard entry, paste splitting, removable chips, validation, normalisation, duplicate handling, and tag limits.

## 0.4.0

### Minor Changes

- 42541cf18d0ef75e9f2192d5fcf08e06f65a7515: Add `Lightbox`, a full-screen media viewer for images, Markdown, plain text, and source files. Source previews use `CodeBlock` with syntax highlighting, while Markdown switches between rendered and source views. Unsupported files show a fallback with a download action when a URL is available.
- 9d66669e29ef53d9bb7c8a18924d28d5632646d9: Add generic `Attachment` and `AttachmentList` components with full-chip previews, removable chips, and shared lightbox navigation. `ChatAttachments` now wraps the generic list, while `FileUpload` previews selected image, Markdown, text, and source files from local object URLs. Source language detection covers common extensions and MIME types, with syntax highlighting for JavaScript/TypeScript, Python, Rust, Go, Java, C/C++, C#, CSS, JSON, YAML, SQL, shell, HTML/XML, Dockerfile, and Makefile. Text and source previews require `content`; unsupported files open a download fallback.
- a1f4431897d23ade4975c822546cc2eb2b2f39c7: Add `SplitButton`, combining a primary action with an adjacent chevron menu. It takes typed menu entries, supports the standard button sizes and every variant except `link`, and keeps the primary and menu actions visually joined.
- ec25b4285121207c7294ca1b151bb4238e3f4256: Add an approval state to `ChatToolCall`. It adds an approval state with a split Allow control: the main action allows once, while the chevron menu offers always-allow and custom allow options. Other actions live in a separate ellipsis menu, with Deny between it and the split control. A `denied` status is available for showing the result.
- 8997df8d55041f0871614d2d3ff319a38106a48a: Add `TreeView` for recursive, keyboard-navigable hierarchies. It supports controlled expansion, single and multiple selection, optional cascading checkboxes, custom node content, and native drag-and-drop from anywhere on a row through `onMove`. The new `moveTreeNode` helper applies drop results immutably.

## 0.3.0

### Minor Changes

- b891505a47acd52ea63ebec3e9f61c7b3f65db90: Add the chat and LLM component family. `Chat` provides a batteries-included
  conversation surface with typed messages, Markdown rendering, message actions,
  copy and feedback controls, and a streaming-aware composer. The underlying
  primitives are exported separately: `ChatViewport`, `ChatMessage`,
  `ChatComposer`, `ChatMarkdown`, `ChatLoader`, `ChatActions`, `ChatToolCall`,
  `ChatReasoning`, `ChatSources`, `ChatSuggestions`, and `ChatAttachments`.

  Add `CodeBlock` with syntax highlighting and copying, `Spinner`, `Loader`,
  `Kbd`, `AvatarGroup`, and `FileUpload`. `ChatComposer` accepts a `toolbar` snippet for
  model and effort controls and an `onFiles` callback for dropped files. Markdown
  is sanitised with `sanitize-html` and code is highlighted with `highlight.js`;
  both are runtime dependencies.

## 0.2.0

### Minor Changes

- 0079e7cda52925c6a31c591a8f5fb94d5001d4f4: Add Calendar for inline single or multiple date selection, Table as a lightweight
  static table, Toggle as a standalone pressed button, and TimePicker with a
  segmented field plus popover stepper. Calendar includes an inline month/year
  picker with a year grid, a single header across multiple months, a current-day
  indicator, and consistent multi-month rows. DatePicker reuses it.
- 55532684163191c2e0b1f2b73e0ae72291f9c467: Polish component APIs and interaction details across the library. Remove
  `IconButton` in favor of `Button` with `size="icon"`; make `Badge` take
  `label` and an optional `icon`; use `children` for `Popover` content; align
  `ToggleGroup` with the Toggle styling; make horizontal `RadioGroup` layouts
  grid-based; reset the `MultiSelect` query after selection; and give `Alert`
  brand titles the brand color.

  Calendar now supports `type="range"`, a centered Today footer link, a dot
  for the current date, and selecting dates outside the visible month. Range
  selection uses a continuous grey band, with endpoints and hover states kept
  as distinct rounded cells. `DateRangePicker` is rebuilt on the range calendar,
  and the date range header includes both years when the range crosses a year.
  The TimePicker popover follows the configured granularity, hiding minutes for
  hour-only pickers and adding a seconds stepper when seconds are enabled.
  Default ToggleGroup items now have a small gap. Storybook docs and stories
  were tightened up alongside those changes.

- 3603ad70232c22408f360db86c80213c4bd81c0e: Add Menubar with typed menu entries, horizontal menu navigation, submenus,
  checkbox and radio items, shortcuts, and controlled active-menu state.
- 3603ad70232c22408f360db86c80213c4bd81c0e: Add NavigationMenu with typed panel and direct-link items, controlled open state,
  hover and keyboard support, and a combined viewport.
- 3603ad70232c22408f360db86c80213c4bd81c0e: Add ContextMenu, HoverCard, MultiSelect, Sidebar, and AppShell. ContextMenu
  reuses the typed menu entry model, HoverCard wraps the link-preview primitive,
  MultiSelect provides chip-based multiple selection, and the layout shells cover
  application chrome.
- 3603ad70232c22408f360db86c80213c4bd81c0e: Add the first pattern components: ConfirmDialog for destructive confirmation flows,
  EmptyState for consistent no-data states, and PageHeader for page-level titles,
  breadcrumbs, and actions.

## 0.1.0

### Minor Changes

- 0e015665760ad9ac20dcc0c0185dfe603f501428: Add the data and integration wave: Sheet, DatePicker, DateRangePicker, Toast,
  CommandPalette, DataTable, and ScrollArea. Add createForm for valibot-backed
  plain Svelte forms and toFieldErrors for mapping Superforms errors into the
  field wrappers. DataTable uses TanStack Table, Toast uses svelte-sonner, and
  the date components use @internationalized/date as a runtime dependency.
- 6e55c62e75912e275fce835d4bfc1cb31d4d7fe9: Add the forms and navigation wave: Textarea, RadioGroup, Slider, ToggleGroup,
  Accordion, Collapsible, Popover, Pagination, Breadcrumb, and Progress. Add
  TextField, TextareaField, SelectField, and CheckboxField wrappers that own label,
  hint, error, and ARIA wiring. Add Installation, Typography, and Accessibility
  foundations pages and update the component guidelines.
- 8dc8a4a3fb5f27f2126e9b1f800c3a04e029c1ae: Add the pattern-setting component wave: Select, Combobox, DropdownMenu, Tabs,
  Card, Alert, Avatar, Checkbox, Switch, and Skeleton. Select and Combobox are
  generic over their item types; DropdownMenu uses a discriminated item union;
  Tabs, Select, Combobox, and DropdownMenu share the typed item and snippet
  conventions documented under Foundations/Component guidelines. Presentational
  components expose curated props rather than inheriting every HTML attribute,
  and Alert borders use the same stronger outline treatment.

### Patch Changes

- Refine the Storybook taxonomy and accordion styling: put Introduction first in Foundations,
  move ToggleGroup to Actions, move Accordion to Layout, add a Feedback category for
  Alert, Progress, Skeleton, and Toast, move Form tooling under Patterns, and use the
  Collapsible hover treatment for accordion triggers.
- 0e015665760ad9ac20dcc0c0185dfe603f501428: Fix the M2 review findings: tighten the field wrapper prop surfaces, fix the
  horizontal radio story, soften the Collapsible hover, remove the duplicate
  Pagination story, collapse long breadcrumbs into an overflow menu, give
  Collapsible triggers horizontal padding, centre vertical slider tracks and
  thumbs, and keep the Dialog close button and footer visible while the body
  scrolls.
- c1e6c6be72a2701f64e893b6709d732684a982b1: Polish base controls: raise light-mode muted text contrast to WCAG AA, lift the
  dark secondary surface, strengthen outline borders on buttons and badges,
  animate input focus rings with reduced-motion support, give invalid inputs a
  clear destructive focus ring, keep long dialog content scrollable, and keep
  Badge and Separator props narrow.
