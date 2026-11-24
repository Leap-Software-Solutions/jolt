# AGENTS.md

## Component surfaces

Keep the public component API and Storybook controls demand-driven.

- Do not expose a prop, option, or Storybook control just because the underlying primitive, native element, or library supports it.
- Do not mirror native HTML attributes such as `inputmode`, `autocomplete`, `spellcheck`, `name`, or arbitrary attribute passthrough unless a concrete product requirement needs it.
- Do not add speculative knobs for formatting, validation, browser hints, or implementation details. Prefer fixed, sensible internal behaviour.
- Add a public option only when an existing prop, snippet, or composition cannot express the use case. When in doubt, leave it out and ask.
- Public additions need tests, documentation, and a changeset entry.
