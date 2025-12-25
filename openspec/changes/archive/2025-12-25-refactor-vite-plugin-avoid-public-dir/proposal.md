# Change: Refactor Vite Plugin to avoid public directory pollution

## Why

Currently, the `@runtime-env/vite-plugin` generates `runtime-env.js` directly into the `public/` directory during development. This pollutes the user's project structure and can lead to conflicts with other plugins or build processes that expect the `public/` directory to contain only static assets. Furthermore, users are required to manually configure Vitest `setupFiles` to point to this file, which is error-prone and adds boilerplate.

## What Changes

- **Dev Mode**: The plugin will now serve `runtime-env.js` via Vite dev server middleware. It will be generated in a temporary directory (`node_modules/.runtime-env/dev/`) and served at the `/runtime-env.js` path. No files will be written to the `public/` directory.
- **Vitest Mode**: The plugin will automatically add the generated `runtime-env.js` (from `node_modules/.runtime-env/vitest/`) to the Vitest `config.test.setupFiles` array. This eliminates the need for manual configuration in `vite.config.ts`.
- **Build Mode**: Since `runtime-env.js` is no longer written to `public/`, the explicit removal of this file during build is no longer necessary and will be removed.

## Impact

- **Affected specs**: `vite-plugin`
- **Affected code**:
  - `packages/vite-plugin/src/dev.ts`
  - `packages/vite-plugin/src/vitest.ts`
  - `packages/vite-plugin/src/build.ts`
- **BREAKING CHANGE**: Users who relied on `public/runtime-env.js` being physically present on disk during development will now find it served virtually. This is generally preferred but technically a change in behavior.
