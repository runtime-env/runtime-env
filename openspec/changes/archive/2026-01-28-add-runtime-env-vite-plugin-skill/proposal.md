# Change: Add runtime-env-vite-plugin Agent Skill

## Why

To ensure AI agents correctly utilize `runtime-env` in Vite projects, distinguishing between runtime configuration (handled by `runtime-env`) and build-time/public configuration (handled by Vite's built-in `import.meta.env`). This reduces hallucination and incorrect implementation patterns.

## What Changes

- Create a new directory `skills/` to house agent skills.
- Initialize the skill using `npx skills init runtime-env-vite-plugin`.
- Add `skills/runtime-env-vite-plugin/SKILL.md` strictly following the Vercel Agent Skills structure.
- Define a new `agent-skills` capability.

## Impact

- **Affected specs**: `agent-skills` (new)
- **Affected code**: New `skills/` directory.
