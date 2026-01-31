## MODIFIED Requirements

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
- **AND** the generated type file (e.g., `src/runtime-env.d.ts`) SHOULD be added to `.gitignore`
- **AND** agents MUST explicitly run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to ensure types are available immediately after setup
- **AND** the `build` script in `package.json` SHOULD be updated to run `vite build` before `tsc` (e.g., `"build": "vite build && tsc"`) to ensure types are generated before type-checking occurs
- **AND** agents MUST keep existing environment files (e.g., `.env`, `.env.development`, `.env.local`) intact as they are required for the plugin to read values
- **AND** the setup MUST perform a migration from old code by instructing agents to use the other two rules (`Use runtime public env in JavaScript/TypeScript` and `Use runtime public env in index.html`) to replace static environment variable usage with runtime ones

#### Scenario: Rule - Add new environment variables

- **WHEN** adding new environment variables or migrating existing ones
- **THEN** agents MUST define them in `.runtimeenvschema.json`
- **AND** agents MUST NOT manually add types for environment variables in any other files
- **AND** agents MUST explicitly run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to ensure types are updated in the IDE and for compilers
- **AND** agents MUST perform deep schema discovery by carefully searching how an environment variable is being used in the source code
- **AND** for environment variables that are parsed or transformed in the source code (e.g., `parseInt(env.VAR)`, `JSON.parse(env.VAR)`, or boolean checks like `env.VAR === 'true'`), they MUST be defined with their appropriate non-string "parsed" types in the schema (e.g., `number`, `object`, `boolean`) to benefit from validation and automatic parsing
- **AND** during migration, agents MUST prioritize clean code by removing manual parsing logic (e.g., `JSON.parse()`) from the source code, as the `runtimeEnv` global will already contain the correctly typed and parsed values
- **AND** agents MUST explicitly ignore legacy type definitions (e.g., in `vite-env.d.ts`, `env.d.ts`, or `ImportMetaEnv`) when they conflict with the actual usage discovered in the source code

#### Scenario: Avoiding the String Trap

- **WHEN** discovering environment variable types from existing code
- **THEN** agents MUST prioritize ACTUAL USAGE (e.g., `JSON.parse()`, `parseInt()`) over static type definitions in `vite-env.d.ts` or similar files
- **AND** agents SHOULD treat `vite-env.d.ts` as a historical artifact that is likely "lazily typed" as string to avoid configuration overhead
- **AND** if a variable is defined as `string` in `vite-env.d.ts` but parsed as an `object` in the code, the schema MUST use `type: "object"`

#### Scenario: Rule - Use runtime public env in JS/TS

- **WHEN** accessing public environment variables in JavaScript or TypeScript
- **THEN** variables WITH the configured prefix (default `VITE_`) MUST be accessed via the `runtimeEnv` global object
- **AND** built-in Vite variables (e.g., `MODE`, `DEV`, `PROD`, `BASE_URL`) MUST continue to be accessed via `import.meta.env`
- **AND** if `runtimeEnv` properties are reported as missing by the IDE or compiler, agents MUST run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` to resolve the issue

#### Scenario: Rule - Use runtime public env in index.html

- **WHEN** using environment variables in `index.html`
- **THEN** EJS-style interpolation `<%= runtimeEnv.VAR_NAME %>` MUST be used
- **AND** the interpolated values SHOULD NOT be quoted if they are intended to be used as parts of strings (e.g., in a URL)
