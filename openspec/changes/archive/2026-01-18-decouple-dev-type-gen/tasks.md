## 1. Specification

- [x] 1.1 Update `vite-plugin` spec to reflect decoupled type generation in dev mode.

## 2. Implementation

- [x] 2.1 Re-order `packages/vite-plugin/src/dev.ts` to execute `gen-ts` before `gen-js` and its early return.

## 3. Verification

- [x] 3.1 Manually verify in `examples/comprehensive-vite` that removing an environment variable triggers a `gen-js` error but still updates `src/runtime-env.d.ts` when the schema changes.
- [x] 3.2 Run existing tests to ensure no regressions.
