## Context

Agents frequently overstep during `runtime-env` integration by modifying read-only `.env` files, cluttering `vite.config.ts`, and adding redundant scripts. They also tend to oversimplify schemas, losing type safety. This design outlines how to formalize stricter rules and better patterns in the agent's core instructions and reference materials.

## Goals / Non-Goals

**Goals:**

- Formalize strict prohibitions for agents (no `.env` modification, no `runtimeEnv` imports, no extra `package.json` scripts).
- Ensure Vite configuration preservation by restricting updates to minimal necessary changes.
- Improve schema accuracy by enforcing deep discovery for Enums, Arrays, and Objects.
- Update the "String Trap" documentation with clear comparison tables.

**Non-Goals:**

- Modifying the actual `runtime-env` library or plugin code.
- Changing the behavior of the `openspec` CLI itself.

## Decisions

### 1. Update `runtime-env-vite-plugin` Skill

The `skills/runtime-env-vite-plugin/SKILL.md` will be updated to include a "Strict Prohibitions" section. This makes the rules explicit for any agent using the skill.

- **Rationale**: Direct instruction in the skill file is the most effective way to influence agent behavior during integration tasks.

### 2. Expand "String Trap" Reference

The documentation regarding "String Traps" will be updated with:

- A comparison table for JSON types (String vs. Enum vs. Array).
- Examples of "Deep Discovery" for complex objects.
- Explicit prohibition of `{"type": "object"}` without defined properties.
- **Rationale**: Providing concrete examples and tables helps agents map source code patterns (like `.split()` or `switch` statements) to the correct schema definitions.

### 3. Refine Vite Setup Instructions

Instructions for updating `vite.config.ts` will be clarified to emphasize "minimal intervention."

- **Rationale**: Agents often replace entire files or add redundant configurations if they are not explicitly told to preserve the existing structure.

## Risks / Trade-offs

- **[Risk]** Agents might become too restrictive and fail to make necessary changes. → **Mitigation**: Ensure prohibitions are specific to files/patterns that _truly_ should not be touched, while keeping "required" changes (like the `build` script swap) clear.
- **[Risk]** Deep discovery might be computationally expensive or complex for large codebases. → **Mitigation**: Focus on usage-based discovery (searching for the variable name) which is already a standard agent pattern.
