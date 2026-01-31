## Why

Agents often struggle with missing type definitions for `runtimeEnv` because they are generated artifacts that are typically gitignored. While the Vite plugin automatically generates types during `vite dev` or `vite build`, agents and users often work on code without starting a development server. In these cases, if the types for `runtimeEnv.*` are missing or incorrect (e.g., after a schema update), the IDE and compiler will report errors. Manual generation is required to sync these types without the overhead of starting a full development environment. Additionally, default Vite project structures often run `tsc` before `vite build`, causing build failures because the types haven't been generated yet.

## What Changes

- Update the `runtime-env-vite-plugin` skill to explicitly instruct agents to run the manual `gen-ts` command when types are missing, after adding new variables, or when `runtimeEnv.*` types are out of sync and a dev server is not currently running.
- Update the skill to recommend adjusting the `build` script in `package.json` to run `vite build` before `tsc` (e.g., `"build": "vite build && tsc"`), ensuring the plugin has an opportunity to generate type definitions before type-checking occurs.
- Correct the `.gitignore` guidance to state that generated type files _should_ be ignored.
- Clarify that during migration, existing environment files (e.g., `.env`, `.env.development`) MUST be kept intact; the plugin reads these files to provide runtime values, so they should not be deleted.
- Add troubleshooting steps for resolving missing types.

## Capabilities

### Modified Capabilities

- `agent-skills`: Update requirements for the `runtime-env-vite-plugin` skill to include manual type generation and build order guidance.

## Impact

- `skills/runtime-env-vite-plugin/` (all rules)
- `openspec/specs/agent-skills/spec.md` (delta spec)
