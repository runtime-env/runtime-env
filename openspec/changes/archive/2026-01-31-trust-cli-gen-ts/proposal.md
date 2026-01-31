## Why

Agents often get confused and enter a "Verification Blindness" loop because they are instructed to gitignore `.d.ts` files and then verify their generation. Standard tools (glob, ls) hide these files by default, causing agents to believe the generation failed. By shifting to a "Trust the CLI" approach, we eliminate this confusion and rely on the compiler for final verification.

## What Changes

- Update `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` to instruct agents NOT to manually verify `.d.ts` generation.
- Update `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` to add a tip about gitignored files and CLI trust.
- Remove prescriptive manual verification steps that trigger the "Verification Blindness" loop.

## Capabilities

### New Capabilities

- `agent-skill-guidance`: New guidance for agents to handle generated/ignored artifacts.

### Modified Capabilities

- `vite-plugin`: Updating documentation and skill guidance for Vite plugin usage.

## Impact

- `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md`
- `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md`
- Agent behavior during environment variable setup and modification.
