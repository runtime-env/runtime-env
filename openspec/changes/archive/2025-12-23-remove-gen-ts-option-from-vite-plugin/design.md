# Design: Automatic gen-ts in Vite Plugin

## Context

The `@runtime-env/vite-plugin` currently requires manual configuration of `genTs` to generate TypeScript definitions. This is redundant for most TypeScript projects which follow a standard structure.

## Goals

- Remove `genTs` from user-facing options.
- Automatically generate `src/runtime-env.d.ts` if `tsconfig.json` is present.
- Maintain the opinionated nature of the plugin.

## Decisions

### TS Detection

The plugin will check for the existence of `tsconfig.json` in the project root (as determined by Vite's `config.root`).

### Output Path

The output path for `gen-ts` will be hardcoded to `src/runtime-env.d.ts`. This aligns with existing conventions in the project.

### Internal Logic

The mode-specific files (`dev.ts`, `build.ts`, etc.) will be updated to:

1. Detect if the project is TypeScript-based.
2. If so, call `runRuntimeEnvCommand("gen-ts", ...)` with the hardcoded output path.
3. The `optionSchema` will no longer include `genTs`.

## Risks / Trade-offs

- Users who want their types elsewhere will be forced to use `src/runtime-env.d.ts`. Given this is an opinionated plugin, this is an acceptable trade-off.
- Projects with a non-standard `tsconfig.json` location (not in root) might not trigger automatic generation. However, standard Vite setups usually have it in the root.
