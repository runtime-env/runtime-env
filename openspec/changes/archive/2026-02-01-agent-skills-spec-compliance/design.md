## Context

The project currently has one primary skill in `skills/runtime-env-vite-plugin` that uses a custom structure (separate `workflows/` and `guides/` directories) and non-standard YAML frontmatter. To align with the [Agent Skills specification](https://agentskills.io/specification), we need to restructure the directory layout and sanitize the frontmatter.

## Goals / Non-Goals

**Goals:**

- Consolidate all auxiliary skill documentation into a single `references/` directory.
- Ensure `SKILL.md` frontmatter only contains spec-defined fields.
- Update the internal `agent-skills` specification to reflect these new standards.
- Maintain functional links and instructions within the skills.

**Non-Goals:**

- Changing the actual instructions or logic of the skills.
- Creating a validation tool (out of scope, can use `skills-ref` later).

## Decisions

### 1. Directory Restructuring

We will rename both `workflows/` and `guides/` to a single `references/` directory.

- **Rationale**: The Agent Skills spec explicitly recommends `references/` for additional documentation. Maintaining separate directories for workflows and guides is a deviation that complicates generic processing.
- **Implementation**:
  - `mv skills/runtime-env-vite-plugin/workflows skills/runtime-env-vite-plugin/references`
  - `mv skills/runtime-env-vite-plugin/guides/* skills/runtime-env-vite-plugin/references/` (then remove empty `guides/`)

### 2. Frontmatter Sanitization

Move `workflows` and `guides` fields into the `metadata` object.

- **Rationale**: The spec defines a strict set of top-level fields. Custom structure must be placed in `metadata` to avoid validation failures.
- **Implementation**: Update `SKILL.md` to use:
  ```yaml
  metadata:
    workflows: [...]
    guides: [...]
  ```

### 3. Link Migration

All relative links in `SKILL.md` pointing to `./workflows/` or `./guides/` will be updated to point to `./references/`.

- **Rationale**: Avoid broken links after the directory rename.

### 4. Specification Alignment

Update `openspec/specs/agent-skills/spec.md` to replace "Workflow directory structure" requirements with the standardized "Reference directory structure" requirements.

- **Rationale**: The internal spec should enforce the external standard we are adopting.

## Risks / Trade-offs

- **[Risk]** Broken links in external documentation. → **Mitigation**: Perform a project-wide search for any references to the old paths.
- **[Risk]** Agent confusion during transition. → **Mitigation**: Ensure the `SKILL.md` body clearly describes the new structure if it mentions file paths.
