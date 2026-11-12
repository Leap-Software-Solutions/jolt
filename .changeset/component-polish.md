---
'@leap/jolt': minor
---

Polish component APIs and interaction details across the library. Remove
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
