# Change: Fix vite-plugin vitest optional peer dependency error

## Why

The `@runtime-env/vite-plugin` unconditionally imports `vitest/config` in its `vitest.ts` file. Since `vitest` is an optional peer dependency, users who do not use Vitest (and thus haven't installed it) encounter a `ERR_MODULE_NOT_FOUND` error when the plugin is loaded, because the default export includes the Vitest-related plugin.

## What Changes

- Remove top-level side-effect import `import "vitest/config"` in `packages/vite-plugin/src/vitest.ts`.
- Use type casting or local type definitions to handle `config.test` property without requiring `vitest` at runtime.
- Ensure the plugin remains functional for Vitest users while being safe for non-Vitest users.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/vitest.ts`
- No breaking changes to the API, but fixes a critical runtime error for a subset of users.
