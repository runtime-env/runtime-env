## 1. Implementation

- [x] 1.1 Update `packages/vite-plugin/src/index.ts` to remove the `options` parameter from the `runtimeEnv` function.
- [x] 1.2 Remove `packages/vite-plugin/src/types.ts`.
- [x] 1.3 Update `packages/vite-plugin/src/utils.ts` to:
  - Remove `Options` and `optionSchema` usage.
  - Implement Vite env file detection logic.
  - Hardcode `schemaFile` and `globalVariableName` defaults.
- [x] 1.4 Refactor `packages/vite-plugin/src/dev.ts` to remove options and use auto-detected env files.
- [x] 1.5 Refactor `packages/vite-plugin/src/preview.ts` to remove options and use auto-detected env files.
- [x] 1.6 Refactor `packages/vite-plugin/src/vitest.ts` to remove options and use auto-detected env files.
- [x] 1.7 Ensure all `runRuntimeEnvCommand` calls use the hardcoded defaults and detected env files.

## 2. Verification

- [x] 2.1 Verify `comprehensive-vite` example works with `runtimeEnv()`.
- [x] 2.2 Run E2E tests for `comprehensive-vite` across all modes (dev, build, preview, test).
