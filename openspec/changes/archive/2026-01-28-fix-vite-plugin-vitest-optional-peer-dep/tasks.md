## 1. Investigation & Reproduction

- [x] 1.1 Create a minimal reproduction to confirm that importing the plugin without `vitest` installed fails.

## 2. Implementation

- [x] 2.1 Remove `import "vitest/config"` from `packages/vite-plugin/src/vitest.ts`.
- [x] 2.2 Update `vitest.ts` to use safe type access for `config.test`.
- [x] 2.3 Build the package and verify `dist/vitest.js` does not contain the `vitest/config` import.

## 3. Verification

- [x] 3.1 Run the reproduction case again to confirm it no longer fails.
- [x] 3.2 Ensure existing tests for `vite-plugin` still pass (with `vitest` installed in the dev environment).
