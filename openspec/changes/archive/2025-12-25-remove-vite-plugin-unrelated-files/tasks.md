## 1. Preparation

- [x] 1.1 Analyze current CLI resolution and temporary file usage in all plugin modes.

## 2. Refactor Common Logic

- [x] 2.1 Consolidate `getRuntimeEnvCommandLineArgs` and `runRuntimeEnvCommand` into `packages/vite-plugin/src/utils.ts`.
- [x] 2.2 Improve CLI resolution in `utils.ts` to be more robust (e.g., using `createRequire` or searching up).
- [x] 2.3 Add a helper in `utils.ts` to get a safe temporary directory within `node_modules/.runtime-env`.

## 3. Update Plugin Modes

- [x] 3.1 Update `packages/vite-plugin/src/dev.ts` to use `utils.ts` and ensure temp files for HTML interpolation are in `node_modules`.
- [x] 3.2 Update `packages/vite-plugin/src/build.ts` to use `utils.ts`.
- [x] 3.3 Update `packages/vite-plugin/src/preview.ts` to use `utils.ts`.
- [x] 3.4 Update `packages/vite-plugin/src/vitest.ts` to use `utils.ts` and use the common temp directory helper.

## 4. Verification

- [x] 4.1 Run existing E2E tests for `comprehensive-vite` and ensure they pass.
- [x] 4.2 Manually verify that no `.vite-runtime-env` files are left in the project root after running dev/build/preview.
- [x] 4.3 Verify that `node_modules/.runtime-env` is used correctly.
