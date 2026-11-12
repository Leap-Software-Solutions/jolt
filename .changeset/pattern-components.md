---
'@leap/jolt': minor
---

Add the pattern-setting component wave: Select, Combobox, DropdownMenu, Tabs,
Card, Alert, Avatar, Checkbox, Switch, and Skeleton. Select and Combobox are
generic over their item types; DropdownMenu uses a discriminated item union;
Tabs, Select, Combobox, and DropdownMenu share the typed item and snippet
conventions documented under Foundations/Component guidelines. Presentational
components expose curated props rather than inheriting every HTML attribute,
and Alert borders use the same stronger outline treatment.
