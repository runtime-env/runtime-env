## Why

The existing skills in the `skills/` directory follow a custom internal structure that deviates from the official [Agent Skills specification](https://agentskills.io/specification). Standardizing on the official spec improves interoperability, leverages common tooling, and ensures a consistent developer experience across projects.

## What Changes

- **Standardize Directory Structure**: Rename `workflows/` and `guides/` subdirectories to `references/` within each skill directory to match the spec's recommendation for additional documentation.
- **Update SKILL.md Frontmatter**: Refactor the YAML frontmatter in `SKILL.md` files to use only supported fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`). Move custom fields like `workflows` and `guides` into the `metadata` map or incorporate them into the Markdown body.
- **Align agent-skills Specification**: Update `openspec/specs/agent-skills/spec.md` to reflect the new structural requirements, ensuring that all future skills are created in compliance with the official specification.
- **Verify Compliance**: Ensure each skill's `name` in `SKILL.md` matches its directory name and that the `description` adheres to the length constraints.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `agent-skills`: Update structural requirements and directory layout standards to align with the official Agent Skills specification.

## Impact

- **Affected Skills**: `skills/runtime-env-vite-plugin` will be restructured.
- **Standardization**: Future skills will follow a predictable, industry-standard format.
- **Spec Documentation**: The project's internal `agent-skills` spec will be synchronized with external standards.
