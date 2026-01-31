## Context

The `runtime-env-vite-plugin` agent skill is currently a collection of rules in a `rules/` directory. While comprehensive, this flat structure allows agents to jump directly to implementation (`03-migration`) without performing necessary codebase analysis (`02-discovery`). This often leads to the "String Trap," where environment variables that should be numbers or booleans are treated as strings because the agent didn't analyze their usage.

## Goals / Non-Goals

**Goals:**

- **Sequential Execution**: Force agents to follow a `Setup -> Discovery -> Migration` sequence.
- **Analysis-First Approach**: Ensure agents perform deep discovery of environment variable usage before updating the schema.
- **Pattern Externalization**: Move complex knowledge like "The String Trap" into a dedicated `guides/` directory.
- **Improved Discipline**: Add explicit "Prerequisites" and "Verification" blocks to each workflow step.

**Non-Goals:**

- Changing the functionality of `@runtime-env/vite-plugin` itself.
- Refactoring the entire `skills/` directory (this serves as a template for future reorganizations).

## Decisions

### 1. Structure: `workflows/` and `guides/`

Instead of a flat `rules/` directory, the skill will be split into:

- `workflows/`: Contains numbered, sequential steps (`01-setup.md`, `02-discovery.md`, `03-migration.md`).
- `guides/`: Contains static reference material (e.g., `the-string-trap.md`).

**Rationale**: Numbering files provides a clear order of operations for agents. Separating guides from workflows keeps the "action" files focused and concise.

### 2. Workflow Content: Prerequisites and Verification

Each workflow file will include:

- **Prerequisites**: What must be true before starting this step (often the completion of the previous step).
- **Verification**: How to confirm the step was completed correctly.

**Rationale**: This creates a "closed-loop" system where the agent is forced to validate its work at each stage.

### 3. SKILL.md as Orchestrator

`SKILL.md` will be updated to explicitly point to the workflow steps in order and define the "When to apply" logic more strictly.

**Rationale**: It remains the entry point for the agent but acts more like a project manager directing the flow.

## Risks / Trade-offs

- **[Risk]** Agents might ignore numbering and jump to `03-migration.md`.
  - **Mitigation**: Add a "Prerequisite: Completion of 02-discovery.md" block at the top of `03-migration.md` and include it in the "Incorrect" section.
- **[Risk]** Fragmentation of information across multiple files.
  - **Mitigation**: Use `SKILL.md` to provide a cohesive overview and clear links between workflows and guides.
- **[Risk]** Human maintainability might decrease with more files.
  - **Mitigation**: The structure is more logical and easier to scale than a single giant rule file.
