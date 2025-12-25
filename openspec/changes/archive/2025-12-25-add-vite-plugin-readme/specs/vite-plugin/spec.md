## MODIFIED Purpose

The `@runtime-env/vite-plugin` provides a zero-config, opinionated integration of `runtime-env` for Vite projects, enabling seamless environment variable management across development, build, and preview stages.

## MODIFIED Requirements

### Requirement: Simplified and Documented Vite Integration

A new Vite-native plugin, `@runtime-env/vite-plugin`, SHALL be provided to simplify the integration of `runtime-env` with Vite projects.

#### Scenario: Plugin is zero-config

- **GIVEN** a user has installed `@runtime-env/vite-plugin`.
- **WHEN** they configure the plugin in their `vite.config.ts` using `runtimeEnv()`.
- **THEN** it SHALL automatically enable `gen-js` and `interpolateIndexHtml` features.
- **AND** it SHALL automatically detect and use Vite's standard environment files (`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`) based on the current Vite mode and `envDir`.
- **AND** it SHALL use default values for `schemaFile` (`.runtimeenvschema.json`) and `globalVariableName` (`runtimeEnv`).
- **AND** the `gen-ts` sub-command SHALL be automatically executed if a `tsconfig.json` file is found in the project root, with a fixed output file `src/runtime-env.d.ts`.
- **AND** the `runtimeEnv` function SHALL NOT accept any arguments.
- **AND** the plugin SHALL provide public documentation (e.g., `README.md`) explaining installation and usage.

#### Scenario: Documentation covers setup and prerequisites

- **GIVEN** a user is reading the `README.md` for `@runtime-env/vite-plugin`.
- **WHEN** they look for setup instructions.
- **THEN** it SHALL guide them to create a `.runtimeenvschema.json` file.
- **AND** it SHALL guide them to create `.env` files.
- **AND** it SHALL guide them to add a `<script>` tag to `index.html` for loading `/runtime-env.js`.
- **AND** it SHALL provide a link to the root `README.md` for `@runtime-env/cli` documentation.

## RENAMED Requirements

- FROM: `### Requirement: Simplified Vite Integration with a Native Plugin`
- TO: `### Requirement: Simplified and Documented Vite Integration`
