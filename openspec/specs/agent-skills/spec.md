# agent-skills Specification

## Purpose

TBD - created by archiving change add-runtime-env-vite-plugin-skill. Update Purpose after archive.

## Requirements

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

### Requirement: Skill Initialization

Agent skills SHALL be initialized using the standard tooling to ensure compliance with the expected structure.

#### Scenario: Initialize via CLI

- **WHEN** a new skill is being created
- **THEN** it MUST be initialized using `npx skills init <skill-name>`

### Requirement: Runtime Env Vite Plugin Skill

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite, following a concise "composition patterns" structure where each rule is defined in its own file and reflected in the specification.

#### Scenario: Rule - Setup runtime-env plugin

- **WHEN** setting up a Vite project with `@runtime-env/vite-plugin`
- **THEN** the plugin MUST be installed using the project's package manager
- **AND** the `runtimeEnv()` plugin MUST be used in vite configuration as a default import
- **AND** the `<script src="/runtime-env.js"></script>` tag MUST be included in `index.html`, before the main application script entry point
- **AND** agents MUST ignore warnings like "can't be bundled without type='module' attribute" for the `runtime-env.js` script tag
- **AND** a `.runtimeenvschema.json` file MUST be created at the project root, listing all public environment variables with appropriate types in JSON-schema format
- **AND** any existing Vite-specific environment variable type definitions (typically found in `src/vite-env.d.ts` as `interface ImportMetaEnv` or `interface ImportMeta`) MUST be removed to prevent conflicts and ensure a single source of truth via `runtimeEnv`
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** the generated type file (e.g., `src/runtime-env.d.ts`) MUST NOT be added to `.gitignore`
- **AND** the setup MUST perform a migration from old code by instructing agents to use the other two rules (`Use runtime public env in JavaScript/TypeScript` and `Use runtime public env in index.html`) to replace static environment variable usage with runtime ones

#### Scenario: Rule - Add new environment variables

- **WHEN** adding new environment variables or migrating existing ones
- **THEN** agents MUST define them in `.runtimeenvschema.json`
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** agents MUST carefully search how an environment variable is being used in the source code
- **AND** for non-simple string environment variables that are parsed or transformed in the source code (e.g., `parseInt(env.VAR)`, `JSON.parse(env.VAR)`, or boolean checks like `env.VAR === 'true'`), they MUST be defined with their appropriate non-string "parsed" types in the schema (e.g., `number`, `object`, `boolean`) to benefit from validation
- **AND** during migration, agents MUST wrap these variables with `JSON.stringify()` (e.g., `JSON.parse(JSON.stringify(runtimeEnv.VAR))`) to keep changes to the source code minimal

#### Scenario: Rule - Use runtime public env in JS/TS

- **WHEN** accessing public environment variables in JavaScript or TypeScript
- **THEN** variables WITH the configured prefix (default `VITE_`) MUST be accessed via the `runtimeEnv` global object
- **AND** built-in Vite variables (e.g., `MODE`, `DEV`, `PROD`, `BASE_URL`) MUST continue to be accessed via `import.meta.env`

#### Scenario: Rule - Use runtime public env in index.html

- **WHEN** using environment variables in `index.html`
- **THEN** EJS-style interpolation `<%= runtimeEnv.VAR_NAME %>` MUST be used
- **AND** the interpolated values SHOULD NOT be quoted if they are intended to be used as parts of strings (e.g., in a URL)
