# agent-skills Specification

## Purpose

TBD - created by archiving change add-runtime-env-vite-plugin-skill. Update Purpose after archive.

## Requirements

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

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite, following a concise "composition patterns" structure where each rule is defined in its own file and reflected in the specification.

#### Scenario: Skill structure follows composition patterns

- **WHEN** the `runtime-env-vite-plugin` skill is defined
- **THEN** it MUST contain a `rules/` directory
- **AND** each rule MUST be in its own markdown file within `rules/`
- **AND** each rule file MUST include both "Correct" and "Incorrect" code or configuration examples

#### Scenario: Rule - Setup runtime-env plugin

- **WHEN** setting up a Vite project with `@runtime-env/vite-plugin`
- **THEN** the `runtimeEnv()` plugin MUST be used in vite configuration
- **AND** the `<script src="/runtime-env.js"></script>` tag MUST be included in `index.html`, before the main application script entry point
- **AND** a `.runtimeenvschema.json` file MUST be created at the project root, listing all public environment variables with appropriate types in JSON-schema format

#### Scenario: Rule - Use runtime public env in JavaScript/TypeScript

- **WHEN** an agent needs to access a variable that must be configurable after build and before runtime (at startup)
- **THEN** it MUST access it via `runtimeEnv.PREFIX_VARIABLE_NAME`
- **AND** it MUST NOT use `import.meta.env.PREFIX_VARIABLE_NAME` for these variables

#### Scenario: Rule - Use runtime public env in index.html

- **WHEN** dynamic values (configured after build) are needed in `index.html`
- **THEN** `<%= runtimeEnv.PREFIX_VARIABLE_NAME %>` placeholders MUST be used
- **AND** the agent MUST NOT use Vite's `%PREFIX_VARIABLE_NAME%` syntax for these dynamic values (as those are replaced at build-time)
