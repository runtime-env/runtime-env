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

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using detected env files) in a temporary directory and append it to `config.test.setupFiles`.
- **AND** it SHALL NOT interfere with the test runner's execution.

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
- **AND** the plugin SHALL serve `runtime-env.js` and the interpolated `index.html` via middleware, without modifying the `dist` directory.
- **AND** it SHALL automatically detect env files suitable for the preview environment.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

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

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience, utilizing the `apply` property for mode-specific logic and providing robust TypeScript types.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/vite-plugin/src` directory
- **WHEN** they view the file structure
- **THEN** they find a modular structure with logic separated by Vite mode (`dev`, `build`, `preview`, `vitest`).
- **AND** shared logic for CLI invocation and file system utilities SHALL be centralized in `utils.ts` to ensure consistency and maintainability.
- **AND** `index.ts` delegates to these modes by returning an array of plugin objects.

#### Scenario: Mode-Specific Logic with `apply`

- **GIVEN** the `@runtime-env/vite-plugin` is loaded by Vite.
- **WHEN** Vite is in `dev`, `build`, `preview`, or `test` mode.
- **THEN** only the plugins relevant to that mode SHALL be active, controlled via the `apply` property or conditional logic in the plugin array.
- **AND** the `test` mode plugin SHALL leverage official Vitest types to ensure type safety without `any` casts.

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

### Requirement: Peer Dependency Requirements

The `@runtime-env/vite-plugin` SHALL define `vite` (version `*`) and `@runtime-env/cli` (version `*`) as peer dependencies to ensure compatibility and avoid duplicate installations in consumer projects.

#### Scenario: Consumer project installation

- **GIVEN** a consumer project using Vite.
- **WHEN** the user installs `@runtime-env/vite-plugin`.
- **THEN** the package manager SHALL verify that `@runtime-env/cli` and `vite` are present in the project.
- **AND** `@runtime-env/vite-plugin` SHALL NOT install its own private copy of `@runtime-env/cli` if it's already present in the project.

### Requirement: Informative and Resilient Integration

The plugin SHALL provide polite, native Vite feedback for all integration issues and remain resilient in server modes, while enforcing mandatory configurations during the build process.

#### Scenario: CLI execution failure in dev or preview

- **GIVEN** the plugin is running in `dev` or `preview` mode.
- **WHEN** a `runtime-env` CLI command (e.g., `gen-js`, `gen-ts`) fails or the schema is missing/invalid.
- **THEN** the plugin SHALL report the CLI's error output as-is, maintaining the `[@runtime-env/cli]` prefix if present in the CLI output.
- **AND** the plugin SHALL report a descriptive error message using Vite's built-in `Logger` with the `[@runtime-env/vite-plugin]` prefix for its own part of the message.
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.
- **AND** in `dev` mode, the plugin SHALL send the error to the Vite HMR overlay to provide immediate feedback in the browser.
- **AND** in `preview` mode, the plugin SHALL continue to report errors via the terminal logger (as `PreviewServer` does not support HMR overlays natively).

#### Scenario: Interpolation failure in dev mode

- **GIVEN** the plugin is running in `dev` mode.
- **WHEN** the `interpolate` CLI command fails during HTML transformation.
- **THEN** the plugin SHALL report the error using Vite's built-in `Logger`.
- **AND** it SHALL send the error to the Vite HMR overlay.

#### Scenario: Error De-duplication

- **GIVEN** the plugin encountered an error and logged it to the terminal.
- **WHEN** the same error occurs again (e.g., due to another file change without fixing the root cause).
- **THEN** the plugin SHALL NOT log the error to the terminal again.
- **AND** in `dev` mode, the plugin SHALL continue to send the error to the HMR overlay to ensure it remains visible.

#### Scenario: Recovery to success state

- **GIVEN** the plugin was previously reporting an error.
- **WHEN** the underlying issue is resolved (e.g., user fixes schema or adds missing env var).
- **THEN** the plugin SHALL NOT log any "recovered" or success message to the terminal or Vite Logger.
- **AND** the plugin SHALL resume normal operation silently.
- **AND** in `dev` mode, the plugin SHALL trigger a full reload to clear the HMR overlay and ensure the latest state is loaded.

#### Scenario: CLI execution failure in build or test

- **GIVEN** the plugin is running in `build` or `test` mode.
- **WHEN** a `runtime-env` CLI command fails or configuration is missing/invalid.
- **THEN** the plugin SHALL report the error politely using Vite's built-in mechanisms.
- **AND** the build or test process SHALL fail.

#### Scenario: Missing runtime-env.js script tag in HTML (Dev)

- **GIVEN** the plugin is active in `dev` mode.
- **AND** the `index.html` file does NOT contain the required `runtime-env.js` script tag, accounting for `base` URL and various script tag formats.
- **WHEN** the plugin processes the HTML.
- **THEN** it SHALL report a polite error using Vite's built-in `Logger` and suggest adding the tag.
- **AND** it SHALL send this error to the Vite HMR overlay.

#### Scenario: Missing runtime-env.js script tag in HTML (Build)

- **GIVEN** the plugin is active in `build` mode.
- **AND** the `index.html` file does NOT contain the required `runtime-env.js` script tag, accounting for `base` URL and various script tag formats.
- **WHEN** the plugin processes the HTML.
- **THEN** it SHALL report a fatal error using Vite's built-in `Logger`.
- **AND** the build process SHALL fail.
