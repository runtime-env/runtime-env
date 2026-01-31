## ADDED Requirements

### Requirement: Skill Workflow Standard

The system SHALL enforce a sequential workflow for agent skills to ensure they perform necessary analysis before making changes.

#### Scenario: Workflow directory structure

- **WHEN** a skill is organized into a workflow
- **THEN** it MUST have a `workflows/` directory instead of a flat `rules/` directory.
- **AND** files in `workflows/` MUST be prefixed with numbers (e.g., `01-`, `02-`) to indicate execution order.
- **AND** it SHOULD have a `guides/` directory for static knowledge and complex patterns.

#### Scenario: Workflow phases

- **WHEN** defining a skill workflow
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

## MODIFIED Requirements

### Requirement: Runtime Env Vite Plugin Skill

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite, following a structured sequential workflow (`setup` -> `discovery` -> `migration`) to ensure reliable integration and clean code.

#### Scenario: Rule - Setup runtime-env plugin

- **WHEN** setting up a Vite project with `@runtime-env/vite-plugin`
- **THEN** the plugin MUST be installed using the project's package manager
- **AND** the `runtimeEnv()` plugin MUST be used in vite configuration as a default import
- **AND** the `<script src="/runtime-env.js"></script>` tag MUST be included in `index.html`, before the main application script entry point
- **AND** agents MUST ignore warnings like "can't be bundled without type='module' attribute" for the `runtime-env.js` script tag
- **AND** a `.runtimeenvschema.json` file MUST be created at the project root, listing all public environment variables with appropriate types in JSON-schema format
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
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** agents MUST explicitly run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to ensure types are updated in the IDE and for compilers
- **AND** agents MUST NOT manually verify the generated file if it is gitignored; they MUST trust the CLI's success output.
- **AND** agents MUST perform deep schema discovery by following the `02-discovery` workflow step, carefully searching how an environment variable is being used in the source code
- **AND** for environment variables that are parsed or transformed in the source code (e.g., `parseInt(env.VAR)`, `JSON.parse(env.VAR)`, or boolean checks like `env.VAR === 'true'`), they MUST be defined with their appropriate non-string "parsed" types in the schema (e.g., `number`, `object`, `boolean`) by following the "String Trap" pattern guide.
- **AND** during migration, agents MUST prioritize clean code by removing manual parsing logic (e.g., `JSON.parse()`) from the source code, as the `runtimeEnv` global will already contain the correctly typed and parsed values
- **AND** agents MUST explicitly ignore legacy type definitions (e.g., in `vite-env.d.ts`, `env.d.ts`, or `ImportMetaEnv`) when they conflict with the actual usage discovered in the source code
