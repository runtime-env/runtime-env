# Spec: Comprehensive Examples E2E Testing

## ADDED Requirements

### Requirement: Development Mode E2E Verification

The comprehensive examples (vite and webpack) SHALL provide E2E tests that verify the development server workflow, including runtime environment variable injection and hot module replacement (HMR). Development mode runs all three commands: gen-ts (types), gen-js (runtime values), and interpolate (HTML templates).

#### Scenario: Dev server starts and displays runtime-env values

**Given** the comprehensive-vite example is installed with runtime-env CLI
**And** `.env` file is created by CI with `echo "FOO=dev-initial" > .env` before starting server
**When** the dev server is started with `npm run dev` via start-server-and-test
**And** Cypress test visits `http://localhost:5173`
**Then** the page displays the value of `runtimeEnv.FOO` from `.env`
**And** the page title contains the runtime-env value
**And** no console errors are present

#### Scenario: HMR updates runtime-env values when .env changes

**Given** the vite dev server is running (via `npm run dev`)
**And** the page is displaying initial value
**When** Cypress updates `.env` file with `cy.exec('echo "FOO=dev-updated" > .env')`
**And** Cypress waits 2000ms for HMR to process the change
**Then** the page automatically displays the new runtime-env value WITHOUT manual reload
**And** the page title updates to reflect the new value
**And** this demonstrates true HMR functionality in Vite

#### Scenario: Test artifacts are cleaned between tests

**Given** a test mode has completed
**When** the next test mode runs
**Then** `git clean -xdf` removes all untracked files including `.env`
**And** a fresh `.env` is generated for the next test

---

### Requirement: Test Mode Execution Verification

The comprehensive examples SHALL verify that test runners (Vitest/Jest) run successfully with runtime environment variable types and values available. Following "build once, deploy anywhere" workflow, tests run gen-ts + gen-js (and optionally interpolate if testing HTML). Tests SHALL run directly via `npm run test` in CI without Cypress wrapper.

#### Scenario: tests execute successfully

**Given** the example is installed
**And** `.env` file exists with test environment variables
**When** CI runs `npm run test` directly
**Then** the command exits with code 0

---

### Requirement: Preview Mode E2E Verification (Vite only)

The comprehensive-vite example SHALL provide E2E tests that verify the preview server serves the production build with interpolated runtime environment values and functional service worker. Following "build once, deploy anywhere" workflow, the build runs gen-ts only (preserving templates), then the deploy stage runs gen-js + interpolate.

#### Scenario: Preview server serves interpolated content

**Given** the production build is created with `npm run build` WITHOUT .env
**When** `.env` file is created AFTER build (deploy stage simulation)
**And** `npm run preview` is executed via start-server-and-test
**And** Cypress test in `cypress/e2e/preview.cy.js` visits `http://localhost:4173`
**Then** the page displays the actual runtime-env value
**And** the page title contains the actual runtime-env value
**And** the service worker installs successfully in the browser

#### Scenario: Preview service worker updates with new env values (preview-sw.cy.js)

**Given** initial preview test has completed successfully
**And** the preview server has been terminated
**And** the production build is NOT recreated (demonstrates "build once, deploy anywhere")
**When** the `.env` file is modified with a new value for `FOO`
**And** `npm run preview` is executed again via start-server-and-test
**And** Cypress test in `cypress/e2e/preview-sw.cy.js` runs (separate test file)
**And** the browser reloads the page once (service worker installs new files)
**And** the new service worker installs successfully in the browser
**And** the browser reloads the page again (service worker activates new files)
**Then** the page displays the new runtime-env value (not the old value)
**And** the page title contains the new runtime-env value

---

### Requirement: Docker Deployment E2E Verification

The comprehensive examples SHALL provide E2E tests that verify Docker container deployment with runtime environment variable injection at container startup.

#### Scenario: Docker image builds successfully

**Given** the comprehensive example has a Dockerfile
**And** the runtime-env CLI tarball is available
**When** `docker build . -t runtime-env-comprehensive-{vite|webpack}` is executed
**Then** the Docker image builds without errors

#### Scenario: Docker container serves app with runtime injection

**Given** the Docker image has been built (environment-agnostic)
**When** a container is started with `docker run -p 3000:80 -e FOO=docker-test runtime-env-comprehensive-{vite|webpack}`
**And** a browser visits `http://localhost:3000`
**Then** the page displays the value "docker-test" from the container environment variable
**And** the page title contains "docker-test"

#### Scenario: Docker container patches service worker

**Given** the Docker container is running
**When** the browser visits `http://localhost:3000`
**Then** the service worker installs successfully

#### Scenario: Docker service worker updates with new env values (docker-sw.cy.js)

**Given** initial docker test has completed successfully
**And** the Docker image is remained intact
**When** a new container is started via start-server-and-test with the image
**And** Cypress test in `cypress/e2e/docker-sw.cy.js` runs (separate test file)
**And** the browser reloads the page once (service worker installs new files)
**And** the new service worker installs successfully in the browser
**And** the browser reloads the page again (service worker activates new files)
**Then** the page displays "docker-updated" (not the old value)
**And** the page title contains "docker-updated" (not the old value)

#### Scenario: Docker containers are cleaned up after tests

**Given** Docker E2E tests have completed
**Then** all containers with ancestor matching the example are stopped
**And** all stopped containers are removed
**And** no orphaned containers remain

---

### Requirement: CI Integration for E2E Tests

The comprehensive example E2E tests SHALL run in CI using the packed tarball installation pattern consistent with other examples.

#### Scenario: CI runs comprehensive E2E tests

**Given** the CI workflow builds and packs runtime-env packages
**When** the comprehensive example test steps run
**Then** each test mode has its own separate CI step
**And** each step changes to the example directory
**And** each step runs `git clean -xdf` inside the example directory to reset environment
**And** each step runs `npm ci` to install dependencies
**And** each step (except docker) installs the tarball with `npm i ../../packages/cli/runtime-env-cli-test.tgz`
**And** docker copies the tarball into the build context for installation in the Dockerfile
**And** dev mode: creates .env then runs inline `start-server-and-test dev http://localhost:{5173|8080} 'cypress run --spec cypress/e2e/dev.cy.js'`
**And** test mode: creates .env then runs `npm run test` directly (no Cypress wrapper)
**And** preview (vite) initial: runs `npm run build`, creates .env, then inline `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'`
**And** preview (vite) SW update: updates .env then inline `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview-sw.cy.js'`
**And** docker initial: builds image with `docker build --build-arg FOO=value`, then inline `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-{vite|webpack}' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'`
**And** docker SW update: rebuilds image with new FOO value, then inline `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-{vite|webpack}' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'`
**And** fails the workflow if any step fails

#### Scenario: E2E tests use tarball not workspace

**Given** the comprehensive E2E tests are running in CI
**When** the test steps run in the same job after packing
**Then** runtime-env CLI is installed from the tarball at `../../packages/cli/runtime-env-cli-test.tgz`
**And** NOT from workspace link or npm registry
**And** this matches the installation pattern of other examples

#### Scenario: Environment is reset between test modes in CI

**Given** a test mode has completed in CI
**When** the next test mode is about to run
**Then** `git clean -xdf` is executed inside the example directory to remove all untracked files
**And** the tarball at `../../packages/cli/runtime-env-cli-test.tgz` remains available (outside example directory)
**And** `.env` file is regenerated based on test mode requirements
**And** `node_modules` and `dist` directories are removed
**And** generated files (`runtime-env.js`, `runtime-env.d.ts`) are removed
**And** the environment is in a clean state for the next test
**And** each test mode can run its appropriate workflow (dev/test/preview/docker)

---

### Requirement: Test Infrastructure Setup

The comprehensive examples SHALL provide the necessary Cypress and test infrastructure to support E2E testing.

#### Scenario: Cypress configuration exists

**Given** the comprehensive example directory
**Then** `cypress.config.js` exists with e2e configuration
**And** `cypress/support/e2e.js` exists for global setup
**And** `cypress/support/commands.js` exists for custom commands
**And** `.gitignore` excludes `cypress/screenshots/` and `cypress/videos/`

#### Scenario: Test execution model for different modes

**Given** E2E tests need to run various npm scripts and manage server processes
**Then** dev, preview (vite), and docker modes use `start-server-and-test` to manage server lifecycle OUTSIDE Cypress
**And** Cypress tests run with servers already available at expected ports
**And** Cypress uses `cy.exec()` ONLY for file operations (updating .env)
**And** test mode runs `npm run test` directly in CI (no Cypress wrapper)
**And** this follows Cypress best practices per documentation

#### Scenario: No npm scripts added to package.json

**Given** the comprehensive example `package.json`
**Then** NO scripts are added to package.json
**And** CI steps use inline `start-server-and-test` commands with existing top-level scripts (`dev`, `preview`, `test`)
**And** Docker tests use inline docker command: `start-server-and-test 'docker run -p 3000:80 --rm ...' http://localhost:3000 'cypress run ...'`
**And** no extra scripts with `:e2e`, `:docker`, or other suffixes are added to package.json

#### Scenario: Dependencies are installed

**Given** the comprehensive example `package.json`
**Then** `cypress` version 15.7.1 is in devDependencies
**And** `start-server-and-test` is in devDependencies
**And** versions match other examples for consistency

---

### Requirement: Test Execution Independence

Each E2E test mode SHALL run independently in CI without requiring other tests to run first. Tests are executed via inline CI commands, not npm scripts.

#### Scenario: Dev test runs independently in CI

**Given** a clean comprehensive example installation
**And** `.env` file is created before running the test
**When** the CI dev test step executes `npm run test:e2e:dev`
**Then** `start-server-and-test` spawns the dev server at expected port
**And** `start-server-and-test` waits for server to be ready (polls localhost)
**And** `start-server-and-test` runs Cypress with dev server already available
**And** Cypress tests use `cy.exec()` to update .env file during test
**And** if dev server fails to start, the command fails before Cypress runs
**And** `start-server-and-test` terminates the server automatically after Cypress completes
**And** completes successfully

#### Scenario: Preview test runs independently in CI (Vite only)

**Given** a clean comprehensive-vite installation
**And** `.env` file is created for initial test
**When** the CI preview test step executes inline command
**Then** CI builds the project with `npm run build`
**And** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'` is executed
**And** `start-server-and-test` spawns preview server at localhost:4173
**And** `start-server-and-test` waits for server to be ready
**And** `start-server-and-test` runs Cypress test from `cypress/e2e/preview.cy.js`
**And** Cypress tests verify interpolated values and service worker
**And** if build or preview server fails, the command fails
**And** `start-server-and-test` terminates the server automatically after Cypress completes
**And** completes successfully

#### Scenario: Preview SW update test runs independently in CI (Vite only)

**Given** the initial preview test has completed
**And** `.env` file is updated with new values
**When** the CI preview SW update step executes inline command
**Then** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview-sw.cy.js'` is executed
**And** `start-server-and-test` spawns preview server with updated env values
**And** `start-server-and-test` runs Cypress test from `cypress/e2e/preview-sw.cy.js`
**And** Cypress tests reload page twice to verify service worker update
**And** `start-server-and-test` terminates the server automatically after Cypress completes
**And** completes successfully

#### Scenario: Docker test runs independently in CI

**Given** a clean comprehensive example installation
**And** Docker image is built in CI step with `docker build --build-arg FOO=value -t comprehensive-{vite|webpack} .`
**When** the CI docker test step executes inline command with start-server-and-test
**Then** `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-{vite|webpack}' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'`
**And** docker command runs container in foreground (no -d flag): `docker run -p 3000:80 --rm comprehensive-{vite|webpack}`
**And** `start-server-and-test` waits for http://localhost:3000 to be ready
**And** `start-server-and-test` runs Cypress test from `cypress/e2e/docker.cy.js`
**And** Cypress tests verify runtime-env injection and service worker patching
**And** `start-server-and-test` terminates the container automatically (sends SIGTERM, --rm flag cleans up)
**And** completes successfully

#### Scenario: Docker SW update test runs independently in CI

**Given** the initial docker test has completed
**And** Docker image is rebuilt with new FOO value
**When** the CI docker SW update step executes inline command
**Then** `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-{vite|webpack}' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'`
**And** docker command runs new container in foreground with updated image
**And** `start-server-and-test` runs Cypress test from `cypress/e2e/docker-sw.cy.js`
**And** Cypress tests reload page twice to verify service worker update
**And** `start-server-and-test` terminates the container automatically (sends SIGTERM, --rm flag cleans up)
**And** completes successfully

#### Scenario: Test mode runs directly without Cypress

**Given** a clean comprehensive example installation
**When** the CI test mode step executes
**Then** `npm run test` is executed directly in CI (not wrapped in Cypress)
**And** if npm run test fails (non-zero exit code), the CI step fails
**And** test runner output is visible in CI logs
**And** this is simpler than wrapping test runners in Cypress

#### Scenario: Tests run in clean environment in CI

**Given** CI is running multiple test modes sequentially
**When** transitioning between test modes
**Then** `git clean -xdf` runs inside the example directory to remove all untracked files
**And** all `node_modules`, `dist`, and generated files in the example are cleaned
**And** the tarball at `../../packages/cli/runtime-env-cli-test.tgz` remains available
**And** `.env` is NOT present during builds
**And** `.env` is only created AFTER build for runtime use
**And** each test mode starts from a pristine state

---

## Example-Specific Details

### comprehensive-vite

- **Dev Server**: Vite (port 5173)
- **Test Runner**: Vitest
- **PWA Plugin**: vite-plugin-pwa
- **Service Worker**: `dist/sw.js`
- **Test Modes**: 5 CI steps (dev, test, preview initial, preview SW update, docker initial, docker updated)
- **Execution**: All server modes use start-server-and-test inline in CI with existing top-level scripts or inline docker commands
- **npm scripts**: NO scripts added to package.json

### comprehensive-webpack

- **Dev Server**: webpack-dev-server (port 8080)
- **Test Runner**: Jest
- **PWA Plugin**: workbox-webpack-plugin
- **Service Worker**: `dist/service-worker.js`
- **Test Modes**: 4 CI steps (dev, test, docker initial, docker updated)
- **Execution**: All server modes use start-server-and-test inline in CI with existing top-level scripts or inline docker commands
- **npm scripts**: NO scripts added to package.json

---

## MODIFIED Requirements

None. This change adds new E2E testing capabilities without modifying existing functionality.

---

## REMOVED Requirements

None. No existing requirements are removed.
