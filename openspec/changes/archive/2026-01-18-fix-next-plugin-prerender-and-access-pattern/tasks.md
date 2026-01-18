## 1. next-plugin Updates

- [x] 1.1 Add `string-replace-loader` to `dependencies` in `packages/next-plugin/package.json`.
- [x] 1.2 Update `packages/next-plugin/src/utils.ts`:
  - [x] Modify `getFilteredEnv` to accept an `isPlaceholder` flag.
  - [x] Modify `populateRuntimeEnv` to attach to `process.env.runtimeEnv` and `(globalThis as any).runtimeEnv`.
  - [x] Add `populateRuntimeEnvWithPlaceholders` helper.
- [x] 1.3 Update `packages/next-plugin/src/with-runtime-env.ts`:
  - [x] Inject Webpack `DefinePlugin` to replace `runtimeEnv`.
  - [x] Inject Turbopack `turbopack.rules` (and `experimental.turbo.rules`) to use `string-replace-loader` for replacing `runtimeEnv`.
  - [x] Ensure it handles both functional and object-based `next.config.js`.
  - [x] Call `populateRuntimeEnvWithPlaceholders` during build.
- [x] 1.4 Update `packages/next-plugin/src/with-runtime-env-phase-production-build.ts` to call `populateRuntimeEnvWithPlaceholders`.
- [x] 1.5 Update `packages/next-plugin/src/components.tsx` to set `window.runtimeEnv` and `globalThis.runtimeEnv`.

## 2. Documentation Updates

- [x] 2.1 Update `README.md` and other documentation to explain the robust access pattern and that `runtimeEnv` is now automatically handled by the plugin.

## 3. Validation

- [x] 3.1 Run tests for `next-plugin`.
- [x] 3.2 Verify `comprehensive-next` build and runtime behavior (especially prerendering).
