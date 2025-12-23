# Change: Remove genTs option from Vite plugin

## Why

The `@runtime-env/vite-plugin` is intended to be opinionated and provide a zero-config experience where possible. Allowing users to configure the `outputFile` for `gen-ts` adds unnecessary complexity and deviates from the "best practice" of placing the types in `src/runtime-env.d.ts`. By removing the `genTs` option and automatically detecting whether to run the command based on the presence of a `tsconfig.json`, we simplify the plugin's configuration and improve the user experience.

## What Changes

- Remove the `genTs` property from the plugin options schema.
- Implement automatic detection of TypeScript projects (e.g., checking for `tsconfig.json`).
- Automatically run `gen-ts` with `outputFile` set to `src/runtime-env.d.ts` if a TypeScript project is detected.
- Update the examples to reflect the simplified configuration.

## Impact

- **BREAKING**: Users who previously configured `genTs` in their `vite.config.ts` will need to remove it.
- **BREAKING**: Users who relied on a custom `outputFile` for `gen-ts` will now have it generated at `src/runtime-env.d.ts`.
- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/types.ts`, `packages/vite-plugin/src/dev.ts`, `packages/vite-plugin/src/build.ts`, `packages/vite-plugin/src/preview.ts`, `packages/vite-plugin/src/vitest.ts`.
