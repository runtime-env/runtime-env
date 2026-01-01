## MODIFIED Requirements

### Requirement: Informative and Resilient Integration

The plugin SHALL provide polite, native Vite feedback for all integration issues and remain resilient in server modes, while enforcing mandatory configurations during the build process.

#### Scenario: CLI execution failure in dev or preview

- **GIVEN** the plugin is running in `dev` or `preview` mode.
- **WHEN** a `runtime-env` CLI command (e.g., `gen-js`, `gen-ts`) fails or the schema is missing/invalid.
- **THEN** the plugin SHALL report a polite and descriptive error message using Vite's built-in `Logger`.
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.

#### Scenario: Recovery to success state

- **GIVEN** the plugin was previously reporting an error.
- **WHEN** the underlying issue is resolved (e.g., user fixes schema or adds missing env var).
- **THEN** the plugin SHALL report a polite success message using Vite's built-in `Logger`.
- **AND** the plugin SHALL resume normal operation.

#### Scenario: CLI execution failure in build or test

- **GIVEN** the plugin is running in `build` or `test` mode.
- **WHEN** a `runtime-env` CLI command fails or configuration is missing/invalid.
- **THEN** the plugin SHALL report the error politely using Vite's built-in mechanisms.
- **AND** the build or test process SHALL fail.

#### Scenario: Missing runtime-env.js script tag in HTML (Dev)

- **GIVEN** the plugin is active in `dev` mode.
- **AND** the `index.html` file does NOT contain the required `runtime-env.js` script tag, accounting for `base` URL and various script tag formats.
- **WHEN** the plugin processes the HTML.
- **THEN** it SHALL report a polite warning using Vite's built-in `Logger` and suggest adding the tag.

#### Scenario: Missing runtime-env.js script tag in HTML (Build)

- **GIVEN** the plugin is active in `build` mode.
- **AND** the `index.html` file does NOT contain the required `runtime-env.js` script tag, accounting for `base` URL and various script tag formats.
- **WHEN** the plugin processes the HTML.
- **THEN** it SHALL report a fatal error using Vite's built-in `Logger`.
- **AND** the build process SHALL fail.
