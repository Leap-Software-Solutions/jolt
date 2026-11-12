---
'@leap/jolt': minor
---

Add the data and integration wave: Sheet, DatePicker, DateRangePicker, Toast,
CommandPalette, DataTable, and ScrollArea. Add `createForm` for valibot-backed
plain Svelte forms and `toFieldErrors` for mapping Superforms errors into the
field wrappers. DataTable uses TanStack Table, Toast uses svelte-sonner, and
the date components use `@internationalized/date` as a runtime dependency.
