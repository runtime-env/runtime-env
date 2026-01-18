## MODIFIED Requirements

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands automatically with sensible defaults, while respecting Vite's `envDir` for environment file resolution.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs `gen-js`, `interpolateIndexHtml`, and the automatically detected `gen-ts` command in watch mode.
- **AND** the plugin SHALL resolve `.env` files from the directory specified in Vite's `envDir` (defaulting to the project root).
- **AND** the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to detected `.env` files or the schema file trigger automatic regeneration and HMR.
- **AND** `gen-ts` SHALL be executed independently of `gen-js` results, ensuring types are always synchronized with the schema.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using environment files detected from `envDir`) in a temporary directory and append it to `config.test.setupFiles`.
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
- **AND** it SHALL automatically detect environment files from `envDir` suitable for the preview environment.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

### Requirement: Informative and Resilient Integration

The plugin SHALL provide polite, native Vite feedback for all integration issues and remain resilient in server modes, while enforcing mandatory configurations during the build process, including prefix validation.

#### Scenario: CLI execution failure in dev or preview

- **GIVEN** the plugin is running in `dev` or `preview` mode.
- **WHEN** a `runtime-env` CLI command (e.g., `gen-js`, `gen-ts`) fails or the schema is missing/invalid.
- **THEN** the plugin SHALL report the CLI's error output as-is, maintaining the `[@runtime-env/cli]` prefix if present in the CLI output.
- **AND** the plugin SHALL report a descriptive error message using Vite's built-in `Logger` with the `[@runtime-env/vite-plugin]` prefix for its own part of the message.
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.
- **AND** in `dev` mode, the plugin SHALL send the error to the Vite HMR overlay to provide immediate feedback in the browser.
- **AND** in `preview` mode, the plugin SHALL continue to report errors via the terminal logger (as `PreviewServer` does not support HMR overlays natively).
- **AND** in `dev` mode, the plugin SHALL attempt to run `gen-ts` even if `gen-js` fails, provided the schema is valid, ensuring that type definitions are updated based on the latest schema.

#### Scenario: Interpolation failure in dev mode

- **GIVEN** the plugin is running in `dev` mode.
- **WHEN** the `interpolate` CLI command fails during HTML transformation.
- **THEN** the plugin SHALL report the error using Vite's built-in `Logger`.
- **AND** it SHALL send the error to the Vite HMR overlay.

#### Scenario: Prefix validation failure in dev or preview

- **GIVEN** the plugin is running in `dev` or `preview` mode.
- **WHEN** one or more keys in `.runtimeenvschema.json` do NOT start with any of the allowed prefixes defined in `envPrefix`.
- **THEN** the plugin SHALL report a descriptive error message listing the offending keys and the allowed prefixes using Vite's built-in `Logger`.
- **AND** the server SHALL NOT terminate.
- **AND** in `dev` mode, the plugin SHALL send the error to the Vite HMR overlay.
- **AND** in `preview` mode, the plugin SHALL report the error via the terminal logger.

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

#### Scenario: Prefix validation failure in build or test

- **GIVEN** the plugin is running in `build` or `test` mode.
- **WHEN** one or more keys in `.runtimeenvschema.json` do NOT start with any of the allowed prefixes defined in `envPrefix`.
- **THEN** the plugin SHALL report the validation error politely using Vite's built-in mechanisms.
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
