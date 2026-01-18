## 1. Implementation

- [x] 1.1 Update `packages/next-plugin/src/utils.ts` to define `process.env.runtimeEnv` as a getter.
- [x] 1.2 Update `packages/next-plugin/src/with-runtime-env.ts` with the new `robustAccessPattern`.
- [x] 1.3 Update `packages/next-plugin/src/components.tsx` to use `globalThis.runtimeEnv`.
- [x] 1.4 Update `comprehensive-next` example if necessary (verify usages).

## 2. Verification

- [x] 2.1 Run `npm run build` in `examples/comprehensive-next` and ensure it succeeds.
- [x] 2.2 Verify that environment variables are NOT baked into the build artifacts of `comprehensive-next`.
- [x] 2.3 Run E2E tests for `comprehensive-next`.
- [x] 2.4 Run `openspec validate update-next-plugin-runtime-env-substitution --strict`.
