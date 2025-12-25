## 1. Implementation

- [x] 1.1 Update `devPlugin` in `packages/vite-plugin/src/dev.ts` to use a unique subdirectory for `transformIndexHtml` (e.g., `dev-interpolate`).
- [x] 1.2 Update the middleware in `devPlugin` to check for `runtime-env.js` relative to `server.config.base`.
- [x] 1.3 Ensure the middleware handles query parameters (e.g., `?v=...`) correctly.

## 2. Verification

- [x] 2.1 Verify `runtime-env.js` is correctly served in `comprehensive-vite` example in dev mode.
- [x] 2.2 Verify it works even when `base` is configured in `vite.config.ts`.
- [x] 2.3 Run existing tests in `packages/vite-plugin`.
