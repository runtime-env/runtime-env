## Context

The `@runtime-env/vite-plugin` is a key entry point for new users. To ensure adoption and clarity, the documentation should be high-quality and follow modern standards.

## Goals

- **React-inspired UX**: The README should feel like a mini-version of `react.dev`.
- **Zero-Config Spotlight**: Emphasize how much is done automatically.
- **Conceptual Grounding**: Explain _why_ runtime environment variables are superior to build-time ones.

## Decisions

### 1. Documentation Structure

The README will use a tiered structure:

1. **Overview**: What is it?
2. **Installation**: How to get it.
3. **Setup**: Prerequisites like `.runtimeenvschema.json`, `.env`, and `index.html` modification.
4. **Usage**: The "Happy Path" in `vite.config.ts`.
5. **The "Build once, deploy anywhere" principle**: A conceptual section explaining the core value.
6. **Advanced Usage**: Link to the root README for CLI details.

### 2. Style Guide

- Use conversational but professional language.
- Prefer code examples over long paragraphs.
- Use GitHub Markdown callouts (e.g., `> [!NOTE]`) for important tips.

## Risks / Trade-offs

- **Maintenance**: High-quality documentation requires more effort to keep in sync with code changes.
