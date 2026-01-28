# Change: Update vite-plugin peerDependencies

## Why

The `@runtime-env/vite-plugin` currently has fixed versions for `vite` and `vitest` in its `peerDependencies`. This can cause installation issues (peer dependency conflicts) for users who are using different (but compatible) versions of these packages. Relaxing these to `*` ensures maximum compatibility and adheres to the project's goal of being an opinionated but flexible integration.

## What Changes

- Update `peerDependencies` in `packages/vite-plugin/package.json` for `vite` and `vitest` to `*`.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/package.json`
