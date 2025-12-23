## 1. Implement Changes in @runtime-env/vite-plugin

- [x] 1.1 Update `packages/vite-plugin/src/types.ts` to remove `genTs` from `optionSchema`.
- [x] 1.2 Implement a helper to detect `tsconfig.json` and determine if `gen-ts` should run.
- [x] 1.3 Update `packages/vite-plugin/src/dev.ts` to automatically run `gen-ts` if TS is detected.
- [x] 1.4 Update `packages/vite-plugin/src/build.ts` to automatically run `gen-ts` if TS is detected.
- [x] 1.5 Update `packages/vite-plugin/src/preview.ts` to remove `genTs` references (mostly in `getRuntimeEnvCommandLineArgs`).
- [x] 1.6 Update `packages/vite-plugin/src/vitest.ts` to automatically run `gen-ts` if TS is detected.

## 2. Update Examples and Tests

- [x] 2.1 Update `examples/comprehensive-vite/vite.config.ts` to remove `genTs` option.
- [x] 2.2 Verify that `comprehensive-vite` still works correctly and `src/runtime-env.d.ts` is generated.
- [x] 2.3 Run all E2E tests for `comprehensive-vite`.

## 3. Validation

- [x] 3.1 Run `npm run build` in `packages/vite-plugin` to ensure no compilation errors.
- [x] 3.2 Run `openspec validate remove-gen-ts-option-from-vite-plugin --strict`.
