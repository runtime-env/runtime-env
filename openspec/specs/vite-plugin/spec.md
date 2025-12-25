# vite-plugin Specification

## Purpose

The `@runtime-env/vite-plugin` provides a zero-config, opinionated integration of `runtime-env` for Vite projects, enabling seamless environment variable management across development, build, preview, and testing stages while adhering to the "build once, deploy anywhere" philosophy.

## Requirements

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands automatically with sensible defaults.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs `gen-js`, `interpolateIndexHtml`, and the automatically detected `gen-ts` command in watch mode.
- **AND** the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to detected `.env` files or the schema file trigger automatic regeneration and HMR.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite build mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite build` (or `npm run build`).
- **THEN** the plugin automatically runs `gen-ts`.
- **AND** the plugin SHALL NOT run `gen-js` or `interpolateIndexHtml` during the build command, preserving the "build once, deploy anywhere" principle.

#### Scenario: Vite preview mode

- **GIVEN** a Vite project has been built using `vite build`.
- **AND** the `@runtime-env/vite-plugin` plugin is active.
- **WHEN** the user runs `vite preview` (or `npm run preview`).
- **THEN** the plugin hooks into the preview server to perform runtime generation for `gen-js` and `interpolateIndexHtml`.
- **AND** it SHALL automatically detect env files suitable for the preview environment.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using detected env files) in a temporary directory and append it to `config.test.setupFiles`.
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
