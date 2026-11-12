# @leap/jolt

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
