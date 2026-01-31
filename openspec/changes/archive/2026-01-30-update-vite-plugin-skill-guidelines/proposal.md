# Change: Update Vite Plugin Skill Guidelines

## Why

To improve the clarity and effectiveness of the `runtime-env-vite-plugin` skill by adding specific guardrails for type management, gitignore practices, and migration strategies, while also suppressing a common but ignorable warning.

## What Changes

- **MODIFIED**: `agent-skills` capability to include new guidelines for the `runtime-env-vite-plugin` skill.
- **Update** `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` with gitignore and script tag warning instructions.
- **Update** `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` with manual type prevention and migration strategy for parsed or transformed environment variables (e.g., numbers, booleans, or JSON).

## Impact

- Affected specs: `agent-skills`
- Affected code: `skills/runtime-env-vite-plugin/`
