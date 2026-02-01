# agent-skills Specification

## Purpose

TBD - created by archiving change add-runtime-env-vite-plugin-skill. Update Purpose after archive.

## Requirements

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

### Requirement: Skill Initialization

Agent skills SHALL be initialized using the standard tooling to ensure compliance with the expected structure.

#### Scenario: Initialize via CLI

- **WHEN** a new skill is being created
- **THEN** it MUST be initialized using `npx skills init <skill-name>`

### Requirement: Runtime Env Vite Plugin Skill

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite, following a structured sequential workflow (`setup` -> `discovery` -> `migration`) to ensure reliable integration and clean code.

#### Scenario: Rule - Setup runtime-env plugin

- **WHEN** setting up a Vite project with `@runtime-env/vite-plugin`
- **THEN** the plugin MUST be installed using the project's package manager
- **AND** the `runtimeEnv()` plugin MUST be used in vite configuration as a default import
- **AND** the `<script src="/runtime-env.js"></script>` tag MUST be included in `index.html`, before the main application script entry point
- **AND** agents MUST ignore warnings like "can't be bundled without type='module' attribute" for the `runtime-env.js` script tag
- **AND** a `.runtimeenvschema.json` file MUST be created at the project root, listing all public environment variables with appropriate types in JSON-schema format
- **AND** agents MUST NOT use the `default` keyword in `.runtimeenvschema.json`.
- **AND** any existing Vite-specific environment variable type definitions (typically found in `src/vite-env.d.ts` as `interface ImportMetaEnv` or `interface ImportMeta`) MUST be removed to prevent conflicts and ensure a single source of truth via `runtimeEnv`
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** the generated type file (e.g., `src/runtime-env.d.ts`) SHOULD be added to `.gitignore`
- **AND** agents MUST explicitly run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to ensure types are available immediately after setup
- **AND** agents MUST TRUST the CLI output for file generation and NOT attempt manual verification if the file is gitignored.
- **AND** the `build` script in `package.json` SHOULD be updated to run `vite build` before `tsc` (e.g., `"build": "vite build && tsc"`) to ensure types are generated before type-checking occurs
- **AND** agents MUST keep existing environment files (e.g., `.env`, `.env.development`, `.env.local`) intact as they are required for the plugin to read values
- **AND** the setup MUST perform a migration from old code by following the `02-discovery` and `03-migration` workflow steps to replace static environment variable usage with runtime ones.

#### Scenario: Rule - Add new environment variables

- **WHEN** adding new environment variables or migrating existing ones
- **THEN** agents MUST define them in `.runtimeenvschema.json`
- **AND** agents MUST NOT use the `default` keyword in `.runtimeenvschema.json`.
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** agents MUST explicitly run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to ensure types are updated in the IDE and for compilers
- **AND** agents MUST NOT manually verify the generated file if it is gitignored; they MUST trust the CLI's success output.
- **AND** agents MUST perform deep schema discovery by following the `02-discovery` workflow step, carefully searching how an environment variable is being used in the source code
- **AND** for environment variables that are parsed or transformed in the source code (e.g., `parseInt(env.VAR)`, `JSON.parse(env.VAR)`, or boolean checks like `env.VAR === 'true'`), they MUST be defined with their appropriate non-string "parsed" types in the schema (e.g., `number`, `object`, `boolean`) by following the "String Trap" pattern guide.
- **AND** during migration, agents MUST prioritize clean code by removing manual parsing logic (e.g., `JSON.parse()`) from the source code, as the `runtimeEnv` global will already contain the correctly typed and parsed values
- **AND** agents MUST explicitly ignore legacy type definitions (e.g., in `vite-env.d.ts`, `env.d.ts`, or `ImportMetaEnv`) when they conflict with the actual usage discovered in the source code

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

### Requirement: Runtime Env Migration Patterns

The system SHALL provide standardized patterns for migrating environment variable usage to `runtimeEnv`, specifically addressing complex parsing scenarios.

#### Scenario: The "String Trap" Pattern

- **WHEN** an environment variable is used with manual parsing (e.g., `JSON.parse`, `parseInt`, `=== 'true'`)
- **THEN** the migration MUST update `.runtimeenvschema.json` with the correct target type (`object`, `number`, `boolean`).
- **AND** it MUST remove the manual parsing logic from the source code.
- **AND** it MUST use the `runtimeEnv` global directly, which provides the correctly typed value.

### Requirement: Agent Discipline and File Preservation

The system SHALL ensure agents respect project boundaries and existing configurations to prevent destructive or redundant changes.

#### Scenario: Preserve existing environment files

- **WHEN** an agent is performing a migration to `runtime-env`
- **THEN** it MUST NOT modify or delete any existing `.env` files (e.g., `.env`, `.env.local`, `.env.production`).
- **AND** it MUST treat these files as read-only sources of truth for environment variable values.

#### Scenario: Minimal Vite configuration updates

- **WHEN** adding the `runtimeEnv` plugin to `vite.config.ts`
- **THEN** it MUST only add the necessary import and append `runtimeEnv()` to the `plugins` array.
- **AND** it MUST NOT modify other settings like aliases, base paths, build targets, or existing plugins.

#### Scenario: No redundant package.json scripts

- **WHEN** working in a Vite project
- **THEN** the agent MUST NOT add `gen-ts` or `gen-js` scripts to `package.json`.
- **AND** it MUST only perform the mandatory `vite build && tsc` swap in the `build` script.

#### Scenario: Global variable usage without imports

- **WHEN** using `runtimeEnv` in source code
- **THEN** the agent MUST NOT add `import { runtimeEnv } from ...` or similar import statements.
- **AND** it MUST use `runtimeEnv` as a global variable.

### Requirement: Refined String Trap Discovery

The system SHALL require deep analysis of environment variable usage to ensure perfect type safety and prevent oversimplified schemas.

#### Scenario: Enum and Union discovery

- **WHEN** an environment variable is used in a `switch` statement, `if-else` chain, or cast to a TypeScript union type
- **THEN** the agent MUST define it as a string with an `enum` in `.runtimeenvschema.json`.
- **AND** it MUST include all possible values identified in the source code in the `enum` array.

#### Scenario: Array and Split discovery

- **WHEN** an environment variable is used with `.split(',')` or similar array transformations
- **THEN** the agent MUST define it as an `array` in `.runtimeenvschema.json`.
- **AND** it MUST specify the correct `items` type (e.g., `string`, `number`).

#### Scenario: Prohibition of generic objects

- **WHEN** an environment variable is identified as an object (e.g., via `JSON.parse`)
- **THEN** the agent MUST NOT use a generic `{"type": "object"}` definition.
- **AND** it MUST perform deep discovery to identify and define the specific `properties` of that object based on its usage in the source code.
