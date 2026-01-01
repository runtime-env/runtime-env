# Change: Leverage Vite plugin API "apply" and use Vitest types

## Why

To improve the maintainability and idiomatic integration of `@runtime-env/vite-plugin` with Vite and Vitest.

- Using the `apply` property allows Vite to skip loading plugins that are not relevant to the current mode, leading to a cleaner and more efficient plugin lifecycle.
- Replacing `any` casts with proper Vitest types in `vitest.ts` improves type safety and developer experience.

## What Changes

- Refactor `packages/vite-plugin/src/index.ts` and mode-specific plugin files to use the `apply` property where appropriate.
- Update `packages/vite-plugin/src/vitest.ts` to use `UserConfig` from `vitest/config` (or equivalent) to avoid `(config as any).test`.
- Clean up conditional checks inside plugin hooks that can now be handled by `apply`.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/index.ts`, `packages/vite-plugin/src/dev.ts`, `packages/vite-plugin/src/build.ts`, `packages/vite-plugin/src/preview.ts`, `packages/vite-plugin/src/vitest.ts`
- No breaking changes expected for users.
