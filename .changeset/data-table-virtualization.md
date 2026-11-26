---
'@leap-online/jolt': minor
---

Add opt-in row virtualization and selection to `DataTable`. Pass `virtualize={{ height: 320 }}` to render only the visible rows in a fixed-height scroll viewport with a sticky header; `rowHeight` sets the initial estimate and rendered rows are measured. Set `selectionMode` to `single` or `multiple`, bind `selectedIds`, and pass `getRowId` for stable row identity.
