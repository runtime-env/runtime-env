## MODIFIED Requirements

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
