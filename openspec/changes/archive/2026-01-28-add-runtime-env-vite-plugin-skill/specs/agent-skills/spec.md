## ADDED Requirements

### Requirement: Agent Skills Structure

The system SHALL provide a structured way to define and store agent skills.

#### Scenario: Skill definition

- **WHEN** a new skill is added
- **THEN** it MUST be placed in `skills/<skill-name>/`
- **AND** it MUST contain a `SKILL.md` file with instructions

### Requirement: Skill Initialization

Agent skills SHALL be initialized using the standard tooling to ensure compliance with the expected structure.

#### Scenario: Initialize via CLI

- **WHEN** a new skill is being created
- **THEN** it MUST be initialized using `npx skills init <skill-name>`

### Requirement: Runtime Env Vite Plugin Skill

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite.

#### Scenario: Runtime vs Build-time Env

- **WHEN** an agent is implementing environment variables in Vite
- **THEN** it MUST use `runtime-env` for runtime values
- **AND** it MUST keep Vite's built-in `import.meta.env` for public (VITE\_) variables
- **AND** it MUST NOT remove Vite's built-in env handling
