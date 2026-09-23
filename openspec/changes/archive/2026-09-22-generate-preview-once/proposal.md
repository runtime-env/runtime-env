## Why

The preview server runs `gen-js` for every `/runtime-env.js` request and `interpolate` for every `index.html` request. Each run spawns the CLI synchronously, blocking the event loop and delaying other responses on every page load. Picking up `.env` edits without a restart is not a goal for preview.

## What Changes

- The preview server SHALL generate `runtime-env.js` and interpolate `index.html` once when it starts, and serve the results for its lifetime.
- `.env` and schema changes SHALL take effect after restarting the preview server.
- Document the restart requirement in `docs/vite/preview.md`.

## Capabilities

### Modified Capabilities

- `vite-plugin`: the preview mode scenario generates once at startup.

## Impact

- `packages/vite-plugin/src/preview.ts`
- `docs/vite/preview.md`
