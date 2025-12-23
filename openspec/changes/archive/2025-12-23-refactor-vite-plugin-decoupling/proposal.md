# Change: Refactor Vite Plugin for Decoupling

## Why

The current `vite-plugin` implementation has coupled logic in `index.ts` and shared runtime dependencies in `utils.ts`. This violates the principle of separation of concerns where each mode (dev, build, preview, test) should be completely standalone. This refactor ensures better maintainability and clearer boundaries.

## What Changes

- **Architecture**: `index.ts` will now return an array of plugins, delegating full control to `dev.ts`, `build.ts`, `preview.ts`, and `vitest.ts`.
- **Refactoring**: `utils.ts` will be removed. Shared logic like `runRuntimeEnvCommand` will be duplicated into each module to ensure they are self-contained.
- **Logic**: Each mode-specific plugin will self-regulate (check `config.command` etc.) instead of relying on `index.ts` to orchestrate.

## Impact

- **Affected specs**: `vite-plugin`
- **Affected code**: `packages/vite-plugin/src/*`
