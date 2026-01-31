## Why

Agents currently tend to default to simple string types for complex environment variables in `.runtimeenvschema.json`, often keeping manual `JSON.parse` or `parseInt` calls in the source code. This leads to redundant code, weaker type safety, and misses the opportunity for the CLI to handle parsing and validation automatically.

## What Changes

- **Deep Schema Discovery**: Guidance for agents to trace how environment variables are used in the source code and infer detailed JSON schemas (objects, numbers, booleans) instead of defaulting to strings.
- **Source Code Simplification**: Guidance to remove manual parsing and conversion logic from the source code once the schema handles it, leading to cleaner and more idiomatic code.
- **Removed Minimal Change Constraint**: Updating the `agent-skills` specification to prioritize code quality and type safety over keeping source code changes to a minimum during migration.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `agent-skills`: Update the requirements for skill structure and runtime-env guidelines to prioritize deep schema discovery and clean migration.

## Impact

- `openspec/specs/agent-skills/spec.md`
- `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md`
- Future agent behavior when setting up or migrating projects to use `runtime-env`.
