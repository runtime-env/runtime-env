## MODIFIED Requirements

### Requirement: Informative and Resilient Integration (Next.js)

The plugin SHALL provide descriptive feedback for integration issues and remain resilient in development mode, while enforcing mandatory configurations during the build process and production startup.

#### Scenario: CLI execution failure in dev

- **GIVEN** the plugin is running in `next dev` mode.
- **WHEN** a `runtime-env` CLI command fails or the schema is invalid.
- **THEN** the plugin SHALL report a descriptive error message to the console.
- **AND** it SHALL leverage Next.js's native error overlay to display the error in the browser (e.g., by having `<RuntimeEnvScript />` throw the error during render).
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.

#### Scenario: Recovery to success state (Next.js)

- **GIVEN** the plugin was previously reporting an error in `next dev`.
- **WHEN** the underlying issue is resolved (e.g., user fixes schema).
- **THEN** the next page render SHALL succeed without showing the error overlay.
- **AND** the application SHALL correctly resolve environment variables.

#### Scenario: CLI execution failure in build

- **GIVEN** the plugin is running during `next build`.
- **WHEN** a `runtime-env` CLI command fails or configuration is invalid (e.g., prefix enforcement failure).
- **THEN** the plugin SHALL report the error politely.
- **AND** the build process SHALL fail.

#### Scenario: CLI execution failure in production start

- **GIVEN** the plugin is running in production mode (`next start` or `node server.js`).
- **WHEN** the environment variables are insufficient or incorrect according to the schema.
- **THEN** the plugin SHALL report a descriptive error message to the console.
- **AND** the process SHALL exit with code 1 immediately.
