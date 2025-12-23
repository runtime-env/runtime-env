## 1. Implement Changes in @runtime-env/vite-plugin

- [ ] 1.1 Update `packages/vite-plugin/src/types.ts` to remove `genTs` from `optionSchema`.
- [ ] 1.2 Implement a helper to detect `tsconfig.json` and determine if `gen-ts` should run.
- [ ] 1.3 Update `packages/vite-plugin/src/dev.ts` to automatically run `gen-ts` if TS is detected.
- [ ] 1.4 Update `packages/vite-plugin/src/build.ts` to automatically run `gen-ts` if TS is detected.
- [ ] 1.5 Update `packages/vite-plugin/src/preview.ts` to remove `genTs` references (mostly in `getRuntimeEnvCommandLineArgs`).
- [ ] 1.6 Update `packages/vite-plugin/src/vitest.ts` to automatically run `gen-ts` if TS is detected.

## 2. Update Examples and Tests

- [ ] 2.1 Update `examples/comprehensive-vite/vite.config.ts` to remove `genTs` option.
- [ ] 2.2 Verify that `comprehensive-vite` still works correctly and `src/runtime-env.d.ts` is generated.
- [ ] 2.3 Run all E2E tests for `comprehensive-vite`.

## 3. Validation

- [ ] 3.1 Run `npm run build` in `packages/vite-plugin` to ensure no compilation errors.
- [ ] 3.2 Run `openspec validate remove-gen-ts-option-from-vite-plugin --strict`.
