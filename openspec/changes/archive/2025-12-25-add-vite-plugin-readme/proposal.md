# Change: Add README for Vite Plugin

## Why

The `@runtime-env/vite-plugin` package currently lacks a `README.md` file. Providing documentation is essential for users to understand how to install and use the plugin, especially given its zero-config nature.

## What Changes

- Create `packages/vite-plugin/README.md`.
- Document installation and usage of the Vite plugin.
- Include a "Setup" section guiding users to:
  - Create `.runtimeenvschema.json` to define environment variables.
  - Create `.env` files for local development.
  - Modify `index.html` to load `/runtime-env.js` via a `<script>` tag.
- Explain the zero-config behavior of the plugin while emphasizing these necessary prerequisites.
- Link to the root project README for documentation on how the `@runtime-env/cli` works.

## Impact

- **Affected specs**: None (documentation only).
- **Affected code**: `packages/vite-plugin/README.md` (new file).
