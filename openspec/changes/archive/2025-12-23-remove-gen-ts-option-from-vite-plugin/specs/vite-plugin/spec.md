## MODIFIED Requirements

### Requirement: Simplified Vite Integration with a Native Plugin

A new Vite-native plugin, `@runtime-env/vite-plugin`, SHALL be provided to simplify the integration of `runtime-env` with Vite projects.

#### Scenario: Plugin is configurable with nested options and is conditional

- **GIVEN** a user has installed `@runtime-env/vite-plugin`.
- **WHEN** they configure the plugin in their `vite.config.ts`, for example `runtimeEnv({ 'gen-js': {} })`.
- **THEN** they can provide a nested configuration object for `gen-js` and `interpolateIndexHtml`.
- **AND** they can provide a `schema` option at the top level to specify the schema file path.
- **AND** the `gen-js` sub-command SHALL only be executed if a `gen-js` object is present.
- **AND** the `interpolateIndexHtml` sub-command SHALL only be executed if an `interpolateIndexHtml` object is present.
- **AND** the options within each object correspond to the CLI arguments for that sub-command (e.g., `outputFile`, `envFile`).
- **AND** `envFile` is a valid option only for `gen-js` and `interpolateIndexHtml` objects, and it accepts an array of strings.
- **AND** the `gen-ts` sub-command SHALL be automatically executed if a `tsconfig.json` file is found in the project root, with a fixed output file `src/runtime-env.d.ts`.
- **AND** the `genTs` option SHALL NOT be available in the plugin configuration.

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands only when they are configured via a nested object or automatically detected.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts` with `{'gen-js': {...}, 'interpolateIndexHtml': {...}}`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs the configured commands (`gen-js`, `interpolateIndexHtml`) and the automatically detected `gen-ts` command in watch mode.
- **AND** if the `interpolateIndexHtml` object is present, the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to `.env` or the schema file trigger automatic regeneration and HMR.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite build mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite build` (or `npm run build`).
- **THEN** the plugin automatically runs `gen-ts`.
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
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL NOT interfere with the test runner's execution.
