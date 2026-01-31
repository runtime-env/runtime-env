# Change: Remove Vite Environment Definitions on Setup

## Why

Vite projects typically use `src/vite-env.d.ts` to define types for environment variables accessed via `import.meta.env`. When migrating to `@runtime-env/vite-plugin`, environment variables should be accessed via the global `runtimeEnv` object instead. Keeping the old definitions in `src/vite-env.d.ts` causes confusion, redundant type definitions, and may lead to accidental usage of the static `import.meta.env` instead of the dynamic `runtimeEnv`.

## What Changes

- Update the `agent-skills` specification to include a requirement for removing existing Vite-specific environment definitions during setup.
- Update the `setup-runtime-env-plugin.md` rule in the `runtime-env-vite-plugin` skill to instruct agents to remove these definitions (typically in `src/vite-env.d.ts`).

## Impact

- Affected specs: `agent-skills`
- Affected skills: `runtime-env-vite-plugin`
- Better developer experience by ensuring a single source of truth for environment variable types.
