---
'@leap-online/jolt': minor
---

Add `DiffViewer` for rendering Git patches in unified or split layouts. It shows file status and line totals, collapses files and hunks, handles renames, copies, binary files, mode changes, CRLF, and missing final newlines, and can reveal whitespace characters as muted markers. Syntax highlighting is inferred from file paths, with an optional `language` override, and hunk headers have a divider from the code. Export `parsePatch` and the normalised diff types for custom renderers.
