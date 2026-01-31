## Why

Agents frequently overstep during `runtime-env` integration by modifying read-only `.env` files, cluttering `vite.config.ts` with unnecessary configurations, and adding redundant `gen-ts`/`gen-js` scripts to `package.json`. Additionally, agents often default to oversimplified `{"type": "object"}` schemas (losing type safety) and incorrectly attempt to `import` the `runtimeEnv` global. This change establishes strict prohibitions and improved patterns to ensure clean, idiomatic, and safe migrations.

## What Changes

- **Update "String Trap" Guide**: Expand with comprehensive comparison tables for all JSON types (including Arrays/Splits) and explicit instructions for "Deep Schema Discovery."
- **Strict Prohibitions**: Formally forbid modifying `.env` files, adding `import` statements for `runtimeEnv`, and adding redundant CLI scripts to `package.json`.
- **Build Script Preservation**: Clarify that while the `vite build && tsc` swap is mandatory, existing project settings in `vite.config.ts` must be preserved.
- **Improved Setup Workflow**: Update the setup guide to emphasize manual CLI verification over permanent script additions.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `agent-skills`: Adding new scenarios and requirements for agent discipline, specifically around file preservation, global variable usage, and schema depth.

## Impact

- **Agent Behavior**: Improved reliability and less "noise" during automated migrations.
- **Documentation**: Clearer guidance for both human users and AI agents on avoiding common pitfalls.
- **Project Structure**: Prevents pollution of `package.json` and `vite.config.ts`.
