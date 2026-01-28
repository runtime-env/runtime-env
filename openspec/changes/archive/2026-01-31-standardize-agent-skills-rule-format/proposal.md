# Change: Standardize Agent Skills Rule Format

## Why

To improve clarity, consistency, and machine-readability of agent skill rules. A stricter format ensures that each rule is focused, easy to understand, and follows a predictable pattern of "Correct" vs "Incorrect" usage.

## What Changes

- **MODIFIED** Requirement: Agent Skills Structure to include strict rule formatting guidelines.
- **MODIFIED** existing rules in `runtime-env-vite-plugin` to adhere to the new format.

## Impact

- Affected specs: `agent-skills`
- Affected code: `skills/runtime-env-vite-plugin/rules/*.md`
