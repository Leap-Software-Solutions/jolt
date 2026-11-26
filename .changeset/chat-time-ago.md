---
'@leap-online/jolt': minor
---

Render `ChatMessage` and `ChatApprovalRequest` timestamps with `TimeAgo`. Their `timestamp` prop now accepts a `DateInput` instead of a preformatted string, so the relative label stays current and the absolute timestamp remains available through the native time element.
