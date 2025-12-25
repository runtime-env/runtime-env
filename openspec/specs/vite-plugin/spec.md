# vite-plugin Specification

## Purpose

TBD - created by archiving change add-vite-plugin. Update Purpose after archive.

## Requirements

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
- **AND** if the `gen-js` object is present, the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the `runtime-env.js` file SHALL remain available even if `interpolateIndexHtml` is also configured.
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

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured with `{'gen-js': {...}}`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` in a temporary directory and append it to `config.test.setupFiles`.
- **AND** it SHALL NOT interfere with the test runner's execution.

### Requirement: Refactor Comprehensive Vite Example

The `comprehensive-vite` example SHALL be refactored to use the new `@runtime-env/vite-plugin` plugin, serving as a best-practice reference for users.

#### Scenario: `comprehensive-vite` is refactored

- **GIVEN** the `comprehensive-vite` example.
- **WHEN** a developer inspects the source code.
- **THEN** `vite.config.ts` contains the `@runtime-env/vite-plugin` plugin configuration.
- **AND** `vite.config.ts` SHALL NOT contain manual `test.setupFiles` configuration for `runtime-env.js`.
- **AND** `package.json` contains simplified scripts:
  - `"dev": "vite"`
  - `"build": "tsc && vite build"`
  - `"preview": "vite preview"`
  - `"test": "vitest"`
- **AND** all E2E tests for dev, preview, test, and docker modes continue to pass.
- **AND** the `comprehensive-webpack` example is explicitly NOT changed.

### Requirement: Vite Plugin Implementation

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/vite-plugin/src` directory
- **WHEN** they view the file structure
- **THEN** they find a modular structure with logic separated by Vite mode (`dev`, `build`, `preview`, `vitest`).
- **AND** shared logic for CLI invocation and file system utilities SHALL be centralized in `utils.ts` to ensure consistency and maintainability.
- **AND** `index.ts` delegates to these modes by returning an array of plugin objects.

#### Scenario: Maintainability

- **GIVEN** a developer needs to modify the plugin's behavior for a specific mode
- **WHEN** they locate the corresponding mode-specific file (e.g., `build.ts`)
- **THEN** they can easily understand and modify the relevant logic without affecting other modes, while utilizing shared helpers from `utils.ts` for common tasks.

### Requirement: Clean Project Root

The `@runtime-env/vite-plugin` SHALL maintain a clean project root by using temporary directories for all internal artifacts.

#### Scenario: No visible artifacts in project root

- **GIVEN** the `@runtime-env/vite-plugin` is active in any mode.
- **WHEN** the plugin needs to generate temporary files (e.g., for HTML interpolation, backups, or serving via middleware).
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output file `src/runtime-env.d.ts` if a `tsconfig.json` is present.
- **AND** `dist/runtime-env.js` and `dist/index.html.backup` are ALLOWED in the `dist` directory as they are used for preview mode.
- **AND** all other temporary artifacts SHALL be stored within `node_modules/.runtime-env` to keep the project root clean.
