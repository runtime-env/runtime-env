# Spec delta: Webpack example

## ADDED Requirements

### Requirement: Preview feature for comprehensive-webpack example

The examples repository SHALL provide a `preview` command or equivalent for the `comprehensive-webpack` example that starts a local preview server showing the built output, matching the UX provided by the `comprehensive-vite` example.

#### Scenario: Start preview server

- **WHEN** a contributor runs the preview command from the `comprehensive-webpack` example directory
- **THEN** a local server SHALL start and serve the built output for manual inspection
- **AND** instructions to stop the server SHALL be documented in the example README

### Requirement: E2E tests for comprehensive-webpack preview

The examples repository SHALL provide Cypress E2E tests for the `comprehensive-webpack` example that validate the preview server serves the production build with interpolated runtime environment values, following the same "build once, deploy anywhere" verification used by `comprehensive-vite`.

#### Scenario: Preview E2E test (initial run)

- **WHEN** the example repository runs `npm run build` in the `comprehensive-webpack` directory
- **AND** CI or the tester creates an `.env` file with `FOO=preview-initial`
- **AND** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js --env EXPECTED_FOO=preview-initial'` is executed
- **THEN** the Cypress test SHALL visit `/` and assert the page displays the interpolated value `preview-initial` in `#app` and the page title

#### Scenario: Preview E2E test (updated env run)

- **WHEN** the `.env` file is updated to `FOO=preview-updated`
- **AND** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js --env EXPECTED_FOO=preview-updated'` is executed
- **THEN** the Cypress test SHALL visit `/` and assert the page displays the interpolated value `preview-updated`, demonstrating the same build can serve different runtime env values without rebuilding

### Requirement: CI workflow preview step for comprehensive-webpack

The CI pipeline SHALL include a job/step named "Test examples/comprehensive-webpack (preview)" that runs the preview E2E workflow using `start-server-and-test` and executes the preview Cypress test twice with different `.env` values to verify the "build once, deploy anywhere" behavior.

#### Scenario: CI preview step

- **WHEN** CI runs the preview step for `examples/comprehensive-webpack`
- **THEN** CI SHALL run `npm run build`, create an `.env` with `FOO=preview-initial`, run the preview E2E test (initial), update `.env` to `FOO=preview-updated`, and run the preview E2E test again (updated)
- **AND** the step SHALL use `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'` to manage the server lifecycle
