## 1. Implementation

- [x] 1.1 Update `packages/vite-plugin/src/preview.ts` to use middleware for `runtime-env.js`.
- [x] 1.2 Update `packages/vite-plugin/src/preview.ts` to use middleware for `index.html` interpolation.
- [x] 1.3 Remove file modification logic (backup creation and direct `dist` writing) from `previewPlugin`.
- [x] 1.4 Ensure `runtime-env.js` and `index.html` are served from memory/temp locations during preview.

## 2. Validation

- [x] 2.1 Run `npm run test` in `examples/comprehensive-vite` (covering preview tests).
- [x] 2.2 Manually verify `dist` remains clean after running `vite preview`.
- [x] 2.3 Verify `dist/index.html` is correctly interpolated when served via `vite preview`.
- [x] 2.4 Verify `runtime-env.js` is correctly served via `vite preview`.
