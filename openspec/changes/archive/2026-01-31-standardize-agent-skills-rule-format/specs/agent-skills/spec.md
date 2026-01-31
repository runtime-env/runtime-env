## MODIFIED Requirements

### Requirement: Agent Skills Structure

The system SHALL provide a structured way to define and store agent skills, following a strict format for rules to ensure clarity and consistency.

#### Scenario: Skill directory structure

- **WHEN** a new skill is added
- **THEN** it MUST be placed in `skills/<skill-name>/`
- **AND** it MUST contain a `SKILL.md` file with instructions and links to rules.

#### Scenario: Rule file format

- **WHEN** an agent skill rule is defined in a markdown file
- **THEN** it MUST contain exactly one H1 title.
- **AND** it MUST contain one or more lines of description immediately following the title.
- **AND** it MUST contain exactly one "Correct" section, defined by a `## Correct` H2 header.
- **AND** it MUST contain exactly one "Incorrect" section, defined by a `## Incorrect` H2 header.
- **AND** these sections MAY contain multiple code blocks, nested sub-sections, or explanatory text to illustrate complex scenarios or multi-file changes.
