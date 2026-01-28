# Change: Update runtime-env-vite-plugin Skill Structure

## Why

The current skill structure for `runtime-env-vite-plugin` is verbose and lacks clear "Correct vs Incorrect" examples. Following the composition patterns from the agent-skills community will make the guidance more actionable and easier for agents to follow.

## What Changes

- Refactor `skills/runtime-env-vite-plugin/SKILL.md` to follow the composition patterns structure.
- Move rules into a `rules/` directory, each in its own file.
- Each rule will include "Correct" and "Incorrect" code blocks.
- Update `openspec/specs/agent-skills/spec.md` to formalize this structure and the 3 core rules for the `runtime-env-vite-plugin` skill.

## Impact

- **Affected files**:
  - `skills/runtime-env-vite-plugin/SKILL.md`
  - `openspec/specs/agent-skills/spec.md`
- **Breaking changes**: None. The guidance remains the same, but the presentation is changed and rules are more strictly defined.
