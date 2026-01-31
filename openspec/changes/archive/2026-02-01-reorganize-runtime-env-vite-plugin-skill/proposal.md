## Why

The `runtime-env-vite-plugin` agent skill is currently structured as a flat set of rules, which sometimes leads to agents skipping critical setup steps or performing batch updates before properly analyzing the codebase. Reorganizing the skill into a sequential workflow with dedicated guides for complex logic (like the "String Trap") will improve agent discipline, reliability, and the quality of generated code.

## What Changes

- **Restructure Directory**: Rename the `rules/` directory to `workflows/` and use numbered files to enforce a mandatory execution sequence.
- **Sequential Workflow**: Split existing logic into three distinct phases: `01-setup`, `02-discovery` (The "Think" phase), and `03-migration` (The "Act" phase).
- **New Pattern Guides**: Create a `guides/` directory to house static knowledge, including complex migration patterns (Boolean toggles, CSV-to-Array, etc.).
- **Enforced Discipline**: Add "Verification" and "Prerequisite" blocks to each workflow step to prevent agents from jumping ahead.
- **Standardized Metadata**: Update `SKILL.md` to act as a strict orchestrator of these workflows.

## Capabilities

### Modified Capabilities

- `agent-skills`: Reorganize the `runtime-env-vite-plugin` skill into a sequential workflow and establish new repository-wide standards for skill workflows and migration patterns.

## Impact

- **Affected Files**: All files within `skills/runtime-env-vite-plugin/`.
- **Agent Behavior**: Agents will be forced to follow a more disciplined, step-by-step approach when applying this skill to projects.
- **Portability**: The new structure will serve as a "Pro" template for future skills in the repository.
