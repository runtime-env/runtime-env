# Change: Update Vite Plugin Skill for Parsed Env Vars

## Why

Currently, the agent skill for `vite-plugin` suggests defining environment variables as `string` in the schema if they are already being parsed in the source code (e.g., `JSON.parse`, `parseInt`). This minimizes codebase changes but misses out on the validation benefits provided by `runtime-env`'s schema-based parsing.

By defining these variables with their actual types (object, number, boolean) in the schema and wrapping them in `JSON.stringify()` in the source code during migration, we can:

1. Enable `runtime-env` to validate the environment variables before the application starts.
2. Keep codebase changes minimal by preserving existing parsing logic in the application.

## What Changes

- **Update** the `agent-skills` specification to recommend using proper "parsed" types (non-string types like `object`, `number`, `boolean`) in the schema and wrapping with `JSON.stringify()` for existing parsed/transformed variables.
- **Update** `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` with the new strategy and examples.

## Impact

- Affected specs: `agent-skills`
- Affected code: `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md`
