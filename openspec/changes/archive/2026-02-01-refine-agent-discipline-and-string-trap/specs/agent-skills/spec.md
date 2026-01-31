## ADDED Requirements

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
