---
'@leap/jolt': minor
---

Add generic `Attachment` and `AttachmentList` components with full-chip previews, removable chips, and shared lightbox navigation. `ChatAttachments` now wraps the generic list, while `FileUpload` previews selected image, Markdown, text, and source files from local object URLs. Source language detection covers common extensions and MIME types, with syntax highlighting for JavaScript/TypeScript, Python, Rust, Go, Java, C/C++, C#, CSS, JSON, YAML, SQL, shell, HTML/XML, Dockerfile, and Makefile. Text and source previews require `content`; unsupported files open a download fallback.
