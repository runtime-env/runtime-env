## 1. Preparation

- [x] 1.1 Verify Vitest type availability in `packages/vite-plugin`

## 2. Implementation

- [x] 2.1 Refactor `vitest.ts` to use proper types instead of `any`
- [x] 2.2 Add `apply` property to `devPlugin`, `buildPlugin`, `previewPlugin`, and `vitestPlugin`
- [x] 2.3 Simplify internal logic by removing redundant mode checks now handled by `apply`
- [x] 2.4 Ensure `index.ts` correctly exports the refactored plugins

## 3. Verification

- [x] 3.1 Run `npm run build` in `packages/vite-plugin` to ensure no type errors
- [x] 3.2 Verify `comprehensive-vite` example still passes tests
  - [x] Dev mode
  - [x] Build mode
  - [x] Preview mode
  - [x] Test mode (Vitest)
