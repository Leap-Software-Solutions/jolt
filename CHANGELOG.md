# @leap/jolt

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
