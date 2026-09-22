## Why

Dev, preview, and Vitest runs started from the same working directory share `node_modules/.runtime-env/{dev,dev-interpolate,preview-gen-js,preview-interpolate,vitest}`. The preview middleware deletes its temp directory after each request and Vitest deletes its directory on startup, so a concurrent run can lose its output mid-generation (`ENOENT … preview-gen-js/runtime-env.js`) or load another run's values.

## What Changes

- Each dev server, preview server, and Vitest run SHALL create its own temp directory with `mkdtempSync` directly under `node_modules/.runtime-env/` (no mode prefix), holding `runtime-env.js` and, for dev and preview, `index.html`.
- Files SHALL be overwritten in place; the directory SHALL NOT be deleted after each transform or request.
- The dev plugin SHALL remove its directory in the `closeBundle` hook, so dev server restarts (e.g. on `.env` changes) do not leave orphaned directories.
- All directories SHALL be removed on process exit, including `SIGINT`, `SIGHUP`, and `SIGTERM`, via `signal-exit`.
- `signal-exit` is added as the plugin's first runtime dependency.

## Capabilities

### Modified Capabilities

- `vite-plugin`: Clean Project Root requirement gains per-run temp directory isolation and cleanup.

## Impact

- `packages/vite-plugin/src/{utils,dev,preview,vitest}.ts`
- `packages/vite-plugin/package.json`: adds `signal-exit` dependency.
- Directories are left behind only when the process is killed with `SIGKILL` or crashes fatally.
