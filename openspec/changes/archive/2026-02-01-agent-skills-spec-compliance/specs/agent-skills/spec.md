## MODIFIED Requirements

### Requirement: Agent Skills Structure

The system SHALL provide a structured way to define and store agent skills, following a strict format for rules to ensure clarity and consistency.

#### Scenario: Skill directory structure

- **WHEN** a new skill is added
- **THEN** it MUST be placed in `skills/<skill-name>/`
- **AND** it MUST contain a `SKILL.md` file.
- **AND** the `SKILL.md` file MUST contain YAML frontmatter with `name` and `description` fields.
- **AND** the `name` field MUST match the directory name.
- **AND** the `description` field MUST be between 1 and 1024 characters.

#### Scenario: Rule file format

- **WHEN** an agent skill rule is defined in a markdown file
- **THEN** it MUST contain exactly one H1 title.
- **AND** it MUST contain one or more lines of description immediately following the title.
- **AND** it MUST contain exactly one "Correct" section, defined by a `## Correct` H2 header.
- **AND** it MUST contain exactly one "Incorrect" section, defined by a `## Incorrect` H2 header.
- **AND** these sections MAY contain multiple code blocks, nested sub-sections, or explanatory text to illustrate complex scenarios or multi-file changes.

## RENAMED Requirements

- FROM: `Requirement: Skill Workflow Standard`
- TO: `Requirement: Skill Reference Standard`

## MODIFIED Requirements

### Requirement: Skill Reference Standard

The system SHALL provide a structured way to include reference material, workflows, and guides for agent skills to ensure they perform necessary analysis before making changes.

#### Scenario: Reference directory structure

- **WHEN** a skill requires additional documentation, workflows, or guides
- **THEN** it MUST have a `references/` directory.
- **AND** it SHOULD NOT use separate `workflows/` or `guides/` directories at the root of the skill.
- **AND** files in `references/` that define a sequence MUST be prefixed with numbers (e.g., `01-`, `02-`) to indicate execution order.

#### Scenario: Workflow phases

- **WHEN** defining a skill workflow within `references/`
- **THEN** it MUST include three distinct phases:
  - `01-setup`: Initial project configuration and installation.
  - `02-discovery`: Codebase analysis and "thinking" phase.
  - `03-migration`: The "acting" phase where code changes are applied.

#### Scenario: Enforcement mechanisms

- **WHEN** an agent uses a workflow step
- **THEN** it MUST verify "Prerequisites" before starting.
- **AND** it MUST perform "Verification" steps before considering the step complete.
