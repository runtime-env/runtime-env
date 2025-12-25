# Change: Refactor Vite Plugin Preview to Keep Dist Intact

## Why

The current implementation of `@runtime-env/vite-plugin` modifies the `dist` directory in-place during the `preview` phase by creating `dist/index.html.backup` and `dist/runtime-env.js`. This is problematic because:

1. It leaves "dirty" files in the build output.
2. The Vite preview server might intercept and serve these backup files if requested.
3. Users expect the `dist` directory to remain in its build-time state, where `index.html` is not interpolated and `runtime-env.js` does not exist.

## What Changes

- Refactor `previewPlugin` to use Connect middleware to serve `runtime-env.js` and interpolated `index.html`.
- Stop creating `dist/index.html.backup` and `dist/runtime-env.js`.
- Ensure `index.html` is read from `dist`, interpolated in memory (or via a temporary file outside of `dist`), and served to the client.

## Impact

- Affected specs: `specs/vite-plugin/spec.md`
- Affected code: `packages/vite-plugin/src/preview.ts`
- User experience: Improved, as the `dist` folder remains clean after running `vite preview`.
