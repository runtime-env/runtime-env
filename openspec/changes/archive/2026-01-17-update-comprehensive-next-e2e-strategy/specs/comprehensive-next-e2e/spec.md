## ADDED Requirements

### Requirement: Test Infrastructure Setup (Next.js)

The comprehensive-next example SHALL provide the necessary Cypress and test infrastructure to support E2E testing, consistent with other comprehensive examples.

#### Scenario: Cypress configuration exists

- **GIVEN** the comprehensive-next example directory
- **THEN** `cypress.config.js` SHALL exist with e2e configuration
- **AND** `cypress/support/e2e.js` SHALL exist for global setup
- **AND** `.gitignore` SHALL exclude `cypress/screenshots/` and `cypress/videos/`

#### Scenario: Test execution model for different modes

- **GIVEN** E2E tests need to run various npm scripts and manage server processes
- **THEN** dev and docker modes SHALL use `start-server-and-test` to manage server lifecycle OUTSIDE Cypress
- **AND** Cypress tests SHALL run with servers already available at expected ports

#### Scenario: No npm scripts added to package.json

- **GIVEN** the comprehensive-next example `package.json`
- **THEN** NO scripts SHALL be added to package.json specifically for E2E testing (e.g., `test:dev`, `test:prod`)
- **AND** CI steps SHALL use inline `start-server-and-test` commands with existing top-level scripts (`dev`, `build`, `start`)

### Requirement: Test Execution Independence (Next.js)

Each E2E test mode SHALL run independently in CI without requiring other tests to run first. Tests are executed via inline CI commands, not npm scripts.

#### Scenario: Dev test runs independently in CI

- **GIVEN** a clean comprehensive-next installation
- **AND** `.env` file is created before running the test
- **WHEN** the CI dev test step executes
- **THEN** `start-server-and-test` SHALL spawn the dev server at expected port
- **AND** `start-server-and-test` SHALL run Cypress with dev server already available
- **AND** `start-server-and-test` SHALL terminate the server automatically after Cypress completes

#### Scenario: Docker test runs in single CI step

- **GIVEN** a clean comprehensive-next installation
- **WHEN** the CI docker test step executes
- **THEN** Docker image SHALL be built once
- **AND** `start-server-and-test` SHALL be used to run the container and Cypress verification
- **AND** containers SHALL be cleaned up after the test

## RENAMED Requirements

- FROM: `### Requirement: Production Mode E2E Verification (Next.js)`
- TO: `### Requirement: Preview Mode E2E Verification (Next.js)`

## MODIFIED Requirements

### Requirement: Development Mode E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify the `next dev` workflow, including runtime environment variable injection and consistency between Server and Client Components. Development mode runs all three commands via the plugin: gen-ts (types), gen-js (runtime values), and interpolate (if applicable).

#### Scenario: Dev server starts and displays runtime-env values

- **GIVEN** the comprehensive-next example is installed with runtime-env CLI
- **AND** `.env` file is created by CI with `echo "NEXT_PUBLIC_FOO=dev-initial" > .env` before starting server
- **WHEN** the dev server is started with `npm run dev` via start-server-and-test
- **AND** Cypress test visits the home page
- **THEN** the page SHALL display the value of `runtimeEnv.NEXT_PUBLIC_FOO` from `.env` in both Server and Client Components
- **AND** the document title SHALL contain the runtime-env value
- **AND** no console errors SHALL be present

#### Scenario: Dev server serves updated values when .env changes (HMR)

- **GIVEN** `next dev` is running (via `npm run dev`) and displaying initial values
- **WHEN** Cypress updates `.env` file with `cy.exec('echo "NEXT_PUBLIC_FOO=dev-updated" > .env')`
- **AND** Cypress waits for HMR to process the change
- **THEN** the page SHALL automatically display the new runtime-env value
- **AND** the document title SHALL update to reflect the new value

### Requirement: Preview Mode E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify the production build workflow (`next build && next start`), ensuring runtime environment variables are correctly interpolated into the build artifacts.

#### Scenario: Preview server starts and displays runtime-env values

- **GIVEN** the comprehensive-next example is built with `npm run build`
- **AND** `.env` file is created AFTER build with `echo "NEXT_PUBLIC_FOO=preview-test" > .env`
- **WHEN** the production server is started with `npm run start` via start-server-and-test
- **AND** Cypress test visits the home page
- **THEN** the page SHALL display "preview-test" in both Server and Client Components
- **AND** the document title SHALL contain "preview-test"
- **AND** no console errors SHALL be present

#### Scenario: Subsequent server start reflects .env changes

- **GIVEN** the production server was previously started and verified
- **WHEN** the server is stopped
- **AND** `.env` is updated with `echo "NEXT_PUBLIC_FOO=preview-updated" > .env`
- **AND** the server is started again with `npm run start`
- **THEN** the page SHALL display the new value "preview-updated"

### Requirement: Docker Deployment E2E Verification (Next.js)

The comprehensive-next example SHALL provide E2E tests that verify Docker container deployment (using Next.js standalone output) with runtime environment variable injection at container startup.

#### Scenario: Docker image builds successfully

- **GIVEN** the comprehensive-next example has a Dockerfile
- **AND** the runtime-env CLI and next-plugin tarballs are available
- **WHEN** `docker build . -t comprehensive-next` is executed
- **THEN** the Docker image SHALL build without errors

#### Scenario: Docker container serves app with runtime injection

- **GIVEN** the Docker image has been built (environment-agnostic)
- **WHEN** a container is started with `docker run -p 3000:3000 -e NEXT_PUBLIC_FOO=docker-test comprehensive-next`
- **AND** a browser visits `http://localhost:3000`
- **THEN** the page SHALL display "docker-test" in both Server and Client Components
- **AND** the document title SHALL contain "docker-test"

#### Scenario: Subsequent container start reflects environment changes

- **GIVEN** a container was previously started and verified from the `comprehensive-next` image
- **WHEN** the container is stopped
- **AND** a new container is started from the SAME image with `-e NEXT_PUBLIC_FOO=docker-updated`
- **THEN** the page SHALL display the new value "docker-updated"

#### Scenario: Docker containers are cleaned up after tests

- **GIVEN** Docker E2E tests have completed
- **THEN** all containers with ancestor matching the example SHALL be stopped and removed

### Requirement: CI Integration for Next.js E2E

The comprehensive-next E2E tests SHALL be integrated into the project's CI pipeline (`ci.yml`) following the established pattern for other comprehensive examples, emphasizing environment isolation and tarball installation.

#### Scenario: CI runs Next.js E2E tests

- **GIVEN** the CI workflow builds and packs runtime-env packages
- **WHEN** the `test-example-next` job runs
- **THEN** it SHALL execute separate steps for:
  - **Dev Mode**: creates .env then runs inline `start-server-and-test dev http://localhost:3000 'cypress run --spec cypress/e2e/dev.cy.js'`
  - **Preview Mode**:
    - creates .env with initial value
    - runs inline `start-server-and-test 'npm run build && npm run start' http://localhost:3000 'cypress run --spec cypress/e2e/preview.cy.js'`
    - updates .env with new value
    - runs inline `start-server-and-test 'npm run start' http://localhost:3000 'cypress run --spec cypress/e2e/preview.cy.js'`
  - **Docker Mode**:
    - builds image once
    - runs `start-server-and-test 'docker run -e VAR=val1 ...' 3000 'cypress run --spec cypress/e2e/docker.cy.js'`
    - runs `start-server-and-test 'docker run -e VAR=val2 ...' 3000 'cypress run --spec cypress/e2e/docker.cy.js'`
- **AND** each step SHALL run `git clean -xdf` and `git restore .` inside the example directory to reset environment
- **AND** each step SHALL install the tarballs for `cli` and `next-plugin` from `../../packages/`
- **AND** fails the workflow if any step fails

#### Scenario: Environment is reset between test modes in CI

- **GIVEN** a test mode has completed in CI
- **WHEN** the next test mode is about to run
- **THEN** `git clean -xdf` SHALL be executed inside the example directory to remove all untracked files
- **AND** `git restore .` SHALL be executed to restore all tracked files to their committed state
- **AND** the environment SHALL be in a completely clean state for the next test
