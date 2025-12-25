# Change: Fix runtime-env.js serving in Vite dev mode

## Why

In Vite development mode, `runtime-env.js` is sometimes not found by the browser. This happens due to two reasons:

1. `transformIndexHtml` incorrectly deletes the shared `node_modules/.runtime-env/dev` directory (via `rmSync`) after interpolating HTML, which also removes the generated `runtime-env.js` file used by the middleware.
2. The dev server middleware does not account for Vite's `base` path, causing it to fail when the project is served from a non-root path.

## What Changes

- Modified `devPlugin` to use a separate, unique temporary directory for `transformIndexHtml` interpolation to avoid deleting shared artifacts.
- Updated the dev server middleware in `devPlugin` to correctly handle Vite's `base` path and query parameters when serving `/runtime-env.js`.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/dev.ts`
