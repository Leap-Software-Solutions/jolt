---
'@leap/jolt': minor
---

Add the chat and LLM component family. `Chat` provides a batteries-included
conversation surface with typed messages, Markdown rendering, message actions,
copy and feedback controls, and a streaming-aware composer. The underlying
primitives are exported separately: `ChatViewport`, `ChatMessage`,
`ChatComposer`, `ChatMarkdown`, `ChatLoader`, `ChatActions`, `ChatToolCall`,
`ChatReasoning`, `ChatSources`, `ChatSuggestions`, and `ChatAttachments`.

Add `CodeBlock` with syntax highlighting and copying, `Spinner`, `Loader`,
`Kbd`, `AvatarGroup`, and `FileUpload`. `ChatComposer` accepts a `toolbar` snippet for
model and effort controls and an `onFiles` callback for dropped files. Markdown
is sanitised with `sanitize-html` and code is highlighted with `highlight.js`;
both are runtime dependencies.
