# AGENTS.md

## Component surfaces

Keep the public component API and Storybook controls demand-driven.

- Do not expose a prop, option, or Storybook control just because the underlying primitive, native element, or library supports it.
- Do not mirror native HTML attributes such as `inputmode`, `autocomplete`, `spellcheck`, `name`, or arbitrary attribute passthrough unless a concrete product requirement needs it.
- Do not add speculative knobs for formatting, validation, browser hints, or implementation details. Prefer fixed, sensible internal behaviour.
- Add a public option only when an existing prop, snippet, or composition cannot express the use case. When in doubt, leave it out and ask.
- Public additions need tests, documentation, and a changeset entry.

## Consumer-driven intake

- Build a component or utility only when a concrete consumer surface needs it. Name the surface in the PR context, not in the component API.
- Keep Jolt generic. Components receive data, labels, callbacks, and snippets; they never fetch data, own application state, or import consumer-domain concepts.
- Do not put downstream application names or product-specific vocabulary in published docs, stories, code, or changesets. Use generic examples.
- Prefer the existing family and primitive before adding a new component. Check `src/lib/components` and the roadmap first.
- Update `PLAN.md` and the Storybook component guidelines when a public component or utility is added.

## Package constraints

- The package is SvelteKit-free. Use relative imports inside `src/lib`; never `$lib`.
- Export new public utilities and components from the package root deliberately, and add tests for their public behaviour.
- Treat published utilities as API: changing their signatures or formatting rules is a user-facing change and needs a changeset.
