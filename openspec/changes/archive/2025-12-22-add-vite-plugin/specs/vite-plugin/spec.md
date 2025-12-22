## ADDED Requirements

### Requirement: Simplified Vite Integration with a Native Plugin

A new Vite-native plugin, `@runtime-env/vite-plugin`, SHALL be provided to simplify the integration of `runtime-env` with Vite projects.

#### Scenario: Plugin is configurable with nested options and is conditional

- **GIVEN** a user has installed `@runtime-env/vite-plugin`.
- **WHEN** they configure the plugin in their `vite.config.ts`, for example `runtimeEnv({ 'gen-ts': {} })`.
- **THEN** they can provide a nested configuration object for each sub-command (`gen-ts`, `gen-js`, `interpolateIndexHtml`).
- **AND** they can provide a `schema` option at the top level to specify the schema file path.
- **AND** the `gen-ts` sub-command SHALL only be executed if a `gen-ts` object is present in the plugin configuration.
- **AND** the `gen-js` sub-command SHALL only be executed if a `gen-js` object is present.
- **AND** the `interpolateIndexHtml` sub-command SHALL only be executed if an `interpolateIndexHtml` object is present.
- **AND** the options within each object correspond to the CLI arguments for that sub-command (e.g., `outputFile`, `envFile`).
- **AND** `envFile` is a valid option only for `gen-js` and `interpolateIndexHtml` objects, and it accepts an array of strings.

#### Scenario: Vite version compatibility

- **GIVEN** a user has a project using Vite 5 or a newer version.
- **WHEN** they install and configure the `@runtime-env/vite-plugin`.
- **THEN** the plugin SHALL be compatible and function correctly.

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands only when they are configured via a nested object.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts` with `{'gen-ts': {...}, 'gen-js': {...}, 'interpolateIndexHtml': {...}}`.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs the configured commands (`gen-ts`, `gen-js`, `interpolateIndexHtml`) in watch mode.
- **AND** if the `interpolateIndexHtml` object is present, the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to `.env` or the schema file trigger automatic regeneration and HMR.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite build mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts`.
- **WHEN** the user runs `vite build` (or `npm run build`).
- **THEN** the plugin automatically runs `gen-ts` _only if_ a `gen-ts` object is present in the configuration.
- **AND** the plugin SHALL NOT run `gen-js` or `interpolateIndexHtml`, preserving the "build once, deploy anywhere" principle.
- **AND** the `package.json` `build` script is `"build": "tsc && vite build"`.

#### Scenario: Vite preview mode

- **GIVEN** a Vite project has been built using `vite build`.
- **AND** the `@runtime-env/vite-plugin` plugin is configured with `{'gen-js': {...}, 'interpolateIndexHtml': {...}}`.
- **WHEN** the user runs `vite preview` (or `npm run preview`).
- **THEN** the plugin hooks into the preview server to perform runtime generation for the configured commands.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** a Vitest setup file is configured.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL NOT interfere with the test runner's execution.

### Requirement: Refactor Comprehensive Vite Example

The `comprehensive-vite` example SHALL be refactored to use the new `@runtime-env/vite-plugin` plugin, serving as a best-practice reference for users.

#### Scenario: `comprehensive-vite` is refactored

- **GIVEN** the `comprehensive-vite` example.
- **WHEN** a developer inspects the source code.
- **THEN** `vite.config.ts` contains the `@runtime-env/vite-plugin` plugin configuration.
- **AND** `package.json` contains simplified scripts:
  - `"dev": "vite"`
  - `"build": "tsc && vite build"`
  - `"preview": "vite preview"`
  - `"test": "vitest"`
- **AND** all E2E tests for dev, preview, test, and docker modes continue to pass.
- **AND** the `comprehensive-webpack` example is explicitly NOT changed.
