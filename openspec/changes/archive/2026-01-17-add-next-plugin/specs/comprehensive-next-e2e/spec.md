# Capability: Comprehensive Next.js Example E2E

The `examples/comprehensive-next` SHALL provide full E2E verification of the `@runtime-env/next-plugin` using Cypress.

## ADDED Requirements

### Requirement: Development Mode E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify the `next dev` workflow, including runtime environment variable injection and consistency between Server and Client Components.

#### Scenario: Dev server starts and displays runtime-env values

- **GIVEN** the comprehensive-next example is installed
- **AND** `.env` file is created with `FOO=dev-initial`
- **WHEN** the dev server is started with `npm run dev`
- **AND** Cypress visits the home page
- **THEN** the page SHALL display `FOO=dev-initial` in both Server and Client Components
- **AND** the document title SHALL contain `dev-initial`

#### Scenario: Dev server serves updated values when .env changes (HMR)

- **GIVEN** `next dev` is running and displaying initial values
- **WHEN** the `.env` file is updated to `FOO=dev-updated` using `cy.exec`
- **THEN** the page SHALL eventually reflect `FOO=dev-updated` (verifying dev-updated can be served)
- **AND** the document title SHALL eventually reflect `dev-updated`
- **AND** both Server and Client Components SHALL show the updated value without a manual browser reload if possible, or after a transparent dev-server-triggered reload

### Requirement: Production Mode E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify the `next build` and `next start` workflow, ensuring "build once, deploy anywhere" behavior.

#### Scenario: Production build serves injected values

- **GIVEN** the project is built with `next build` WITHOUT a `.env` file
- **WHEN** `.env` is created with `FOO=prod-value` AFTER the build
- **AND** the server is started with `next start`
- **AND** Cypress visits the home page
- **THEN** the page SHALL display `FOO=prod-value` from the current environment
- **AND** the document title SHALL contain `prod-value`
- **AND** the page SHALL NOT require a rebuild to see the new value

### Requirement: Docker Deployment E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify Docker container deployment (using Next.js standalone output) with runtime environment variable injection at container startup.

#### Scenario: Docker container serves app with runtime injection

- **GIVEN** a Docker image is built using the `output: 'standalone'` pattern
- **WHEN** a container is started with `docker run -p 3000:3000 -e FOO=docker-next-test <image>`
- **AND** Cypress visits `http://localhost:3000`
- **THEN** the page SHALL display "docker-next-test" in both Server and Client Components
- **AND** the document title SHALL contain "docker-next-test"

### Requirement: CI Integration for Next.js E2E

The comprehensive-next E2E tests SHALL be integrated into the project's CI pipeline (`ci.yml`) following the established pattern for other comprehensive examples.

#### Scenario: CI runs Next.js E2E tests

- **GIVEN** the CI workflow builds and packs `@runtime-env/next-plugin`
- **WHEN** the `test-example-next` job runs
- **THEN** it SHALL execute separate steps for:
  - **Dev Mode**: `start-server-and-test dev http://localhost:3000 'cypress run ...'`
  - **Test Mode**: `npm run test` (if applicable)
  - **Production Mode**: `npm run build && start-server-and-test start http://localhost:3000 'cypress run ...'`
  - **Docker Mode**: `docker build` (which uses standalone output) and `docker run` with Cypress verification
- **AND** it SHALL use the packed tarballs for installation to ensure realistic testing
