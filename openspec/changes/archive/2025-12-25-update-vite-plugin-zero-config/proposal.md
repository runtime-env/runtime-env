# Change: Zero-Config Vite Plugin

## Why

To provide the most seamless developer experience, `@runtime-env/vite-plugin` should be zero-config. Users should be able to simply add `runtimeEnv()` to their `vite.config.ts` without providing any arguments. The plugin will automatically handle environment file detection, JSON schema location, and global variable naming based on sensible defaults and Vite's own conventions.

## What Changes

- **Zero-Config Function Signature**: The `runtimeEnv` function will no longer take any arguments: `export default function runtimeEnv(): Plugin[]`.
- **Remove All Options**: The `Options` type and `optionSchema` will be removed. All previous configuration options (like `envFile`, `genJs` toggles, etc.) are removed in favor of automated behavior.
- **Automated Feature Activation**: `gen-js`, `interpolateIndexHtml`, and `gen-ts` (if `tsconfig.json` exists) are all automatically enabled.
- **Vite Env File Integration**: The plugin automatically detects Vite's standard environment files based on the current mode and `envDir`. To maintain consistency with `@runtime-env/cli` parsing (e.g., support for JSON values), the plugin only resolves file paths and passes them to the CLI, avoiding the use of Vite's internal `loadEnv` utility for value parsing.
- **Sensible Defaults**:
  - `schemaFile` is fixed to `.runtimeenvschema.json`.
  - `globalVariableName` is fixed to `runtimeEnv`.
  - `outputFile` for `gen-ts` is fixed to `src/runtime-env.d.ts`.

## Impact

- **Affected specs**: `vite-plugin`
- **Affected code**: `packages/vite-plugin/src/index.ts`, `packages/vite-plugin/src/types.ts` (to be removed), `packages/vite-plugin/src/utils.ts`, `packages/vite-plugin/src/dev.ts`, `packages/vite-plugin/src/build.ts`, `packages/vite-plugin/src/preview.ts`, `packages/vite-plugin/src/vitest.ts`.
- **BREAKING**: All existing configuration options for the Vite plugin are removed. Users must call `runtimeEnv()` with no arguments.
- **BREAKING**: Features cannot be selectively disabled via plugin options anymore. If a user doesn't want `gen-js`, they shouldn't include the `<script src="/runtime-env.js">` tag in their HTML.
