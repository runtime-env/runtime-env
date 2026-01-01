## 1. Specification Updates

- [x] 1.1 Update `vite-plugin` spec to reflect build failure on missing script tag.
- [x] 1.2 Update `vite-plugin` spec to mention robust detection with `base` support.

## 2. Implementation

- [x] 2.1 Implement `hasRuntimeEnvScript` utility in `packages/vite-plugin/src/utils.ts`.
- [x] 2.2 Update `packages/vite-plugin/src/build.ts` to fail build if script is missing.
- [x] 2.3 Update `packages/vite-plugin/src/dev.ts` to use new detection utility for warning.
- [x] 2.4 Remove any redundant checks from `packages/vite-plugin/src/preview.ts` (if applicable).

## 3. Verification

- [x] 3.1 Verify that `comprehensive-vite` example build still works (it has the tag).
- [x] 3.2 Manually verify that removing the tag from `index.html` in `comprehensive-vite` causes `npm run build` to fail.
- [x] 3.3 Verify that `dev` mode still shows a warning if the tag is missing.
