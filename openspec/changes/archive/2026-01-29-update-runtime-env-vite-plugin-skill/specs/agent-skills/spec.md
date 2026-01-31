## MODIFIED Requirements

### Requirement: Runtime Env Vite Plugin Skill

The system SHALL provide a skill to guide agents on `runtime-env` usage with Vite, following a concise "composition patterns" structure where each rule is defined in its own file and reflected in the specification.

#### Scenario: Skill structure follows composition patterns

- **WHEN** the `runtime-env-vite-plugin` skill is defined
- **THEN** it MUST contain a `rules/` directory
- **AND** each rule MUST be in its own markdown file within `rules/`
- **AND** each rule file MUST include both "Correct" and "Incorrect" code or configuration examples
- **AND** the `SKILL.md` file MUST list all defined rules in its `rules` frontmatter and provide a summary of each in its body

#### Scenario: Rule - Setup runtime-env plugin

- **WHEN** setting up a Vite project with `@runtime-env/vite-plugin`
- **THEN** the plugin MUST be installed using the project's package manager
- **AND** the `runtimeEnv()` plugin MUST be used in vite configuration as a default import
- **AND** the `<script src="/runtime-env.js"></script>` tag MUST be included in `index.html`, before the main application script entry point
- **AND** a `.runtimeenvschema.json` file MUST be created at the project root, listing all public environment variables with appropriate types in JSON-schema format
- **AND** the setup MUST perform a migration from old code by instructing agents to use the other two rules (`Use runtime public env in JavaScript/TypeScript` and `Use runtime public env in index.html`) to replace static environment variable usage with runtime ones

#### Scenario: Rule - Use runtime public env in JavaScript/TypeScript

- **WHEN** an agent needs to access an environment variable in JavaScript or TypeScript
- **THEN** it MUST check if the variable has the defined prefix (e.g., `VITE_`)
- **AND** if it HAS the prefix, it MUST access it via `runtimeEnv.PREFIX_VARIABLE_NAME` (which is a global variable)
- **AND** if it HAS the prefix, it MUST NOT use `import.meta.env.PREFIX_VARIABLE_NAME`
- **AND** if it DOES NOT have the prefix (e.g., built-in Vite variables like `MODE`, `DEV`, `PROD`, `BASE_URL`), it MUST still use `import.meta.env`

#### Scenario: Rule - Use runtime public env in index.html

- **WHEN** dynamic values are needed in `index.html`
- **THEN** the agent MUST check if the variable has the defined prefix (e.g., `VITE_`)
- **AND** if it HAS the prefix, it MUST use `<%= runtimeEnv.PREFIX_VARIABLE_NAME %>` placeholders
- **AND** if it HAS the prefix, it MUST NOT use Vite's `%PREFIX_VARIABLE_NAME%` syntax
- **AND** if it DOES NOT have the prefix (e.g., built-in Vite variables like `MODE`, `BASE_URL`), it MUST still use Vite's native `%VARIABLE_NAME%` syntax

#### Scenario: Rule - Add new environment variables

- **WHEN** adding a new environment variable to the project
- **THEN** the variable MUST be added to the `.runtimeenvschema.json` file with its appropriate type
- **AND** for complex environment variables (objects or arrays), the agent MUST define them as `object` or `array` types in the schema to enable automatic parsing and type safety by `runtime-env`
- **AND** the rule MUST follow the composition pattern including "Correct" and "Incorrect" code examples
