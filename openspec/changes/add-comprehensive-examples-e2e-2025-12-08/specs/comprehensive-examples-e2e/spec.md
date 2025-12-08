# Spec: Comprehensive Examples E2E Testing

## ADDED Requirements

### Requirement: Development Mode E2E Verification

The comprehensive examples (vite and webpack) SHALL provide E2E tests that verify the development server workflow, including runtime environment variable injection and hot module replacement (HMR).

#### Scenario: Dev server starts and displays runtime-env values (Vite)

**Given** the comprehensive-vite example is installed with runtime-env CLI
**When** the dev server is started with `npm run dev`
**And** a browser visits `http://localhost:5173`
**Then** the page displays the value of `runtimeEnv.FOO` from `.env`
**And** the page title contains the runtime-env value
**And** no console errors are present

#### Scenario: Dev server starts and displays runtime-env values (Webpack)

**Given** the comprehensive-webpack example is installed with runtime-env CLI
**When** the dev server is started with `npm run dev`
**And** a browser visits `http://localhost:8080`
**Then** the page displays the value of `runtimeEnv.FOO` from `.env`
**And** the page title contains the runtime-env value
**And** no console errors are present

#### Scenario: HMR updates runtime-env values when .env changes

**Given** the dev server is running and displaying initial value
**When** the `.env` file is modified with a new value for `FOO`
**Then** the page automatically reloads via HMR (wait with timeout)
**And** the page displays the new runtime-env value
**And** the page title updates to reflect the new value

#### Scenario: Test artifacts are cleaned between tests

**Given** a test mode has completed
**When** the next test mode runs
**Then** `git clean -xdf` removes all untracked files including `.env`
**And** a fresh `.env` is generated for the next test

---

### Requirement: Test Mode Execution Verification

The comprehensive examples SHALL verify that test runners (Vitest/Jest) run successfully with runtime environment variable types and values available. Tests SHALL run directly via `npm run test` in CI without Cypress wrapper.

#### Scenario: Vitest tests execute successfully (Vite)

**Given** the comprehensive-vite example is installed
**When** CI runs `npm run test` directly
**Then** the command exits with code 0
**And** the output contains "Test Files" and "passed"
**And** no test failures are reported
**And** `src/runtime-env.d.ts` is generated (types)
**And** `public/runtime-env.js` is generated (runtime values)

#### Scenario: Jest tests execute successfully (Webpack)

**Given** the comprehensive-webpack example is installed
**When** CI runs `npm run test` directly
**Then** the command exits with code 0
**And** the output shows "PASS" for test files
**And** no test failures are reported
**And** `src/runtime-env.d.ts` is generated (types)
**And** `public/runtime-env.js` is generated (runtime values)

---

### Requirement: Preview Mode E2E Verification (Vite only)

The comprehensive-vite example SHALL provide E2E tests that verify the preview server serves the production build with interpolated runtime environment values and functional service worker.

#### Scenario: Preview server serves interpolated content

**Given** the production build is created with `npm run build`
**When** the preview server is started with `npm run preview`
**And** a browser visits `http://localhost:4173`
**Then** the page displays the actual runtime-env value (not template syntax)
**And** the page title contains the actual runtime-env value
**And** the service worker loads successfully in the browser

#### Scenario: Preview can be rerun with different env values

**Given** preview mode has completed successfully
**And** the preview server has been terminated
**When** the `.env` file is modified with a new value for `FOO`
**And** the production build is NOT recreated (no rebuild required)
**And** the preview server is started with `npm run preview`
**And** the browser reloads the page once (service worker installs new files)
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
**And** the image includes the runtime-env CLI as a single executable application
**And** the image includes the PWA patching script as a single executable
**And** the dist directory is copied to the nginx container

#### Scenario: Docker container serves app with runtime injection

**Given** the Docker image has been built
**When** a container is started with `docker run -p 3000:80 -e FOO=docker-test runtime-env-comprehensive-{vite|webpack}`
**And** a browser visits `http://localhost:3000`
**Then** the page displays the value "docker-test" from the container environment variable
**And** the page title contains "docker-test"
**And** `dist/runtime-env.js` was generated at container startup with the env value

#### Scenario: Docker container patches service worker

**Given** the Docker container is running
**When** the browser visits `http://localhost:3000`
**Then** the service worker loads successfully
**And** the service worker was patched with runtime-env revision
**And** the service worker caches `runtime-env.js` correctly

#### Scenario: Docker container can be restarted with different env values

**Given** a Docker container has run and been stopped
**And** the Docker image is NOT rebuilt (no rebuild required)
**When** a new container is started with `docker run -p 3000:80 -e FOO=docker-updated runtime-env-comprehensive-{vite|webpack}`
**And** a browser visits `http://localhost:3000`
**Then** the page displays "docker-updated" (not the old value)
**And** no cached values from the previous container interfere
**And** the service worker is updated correctly

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
**And** steps after the first run `git clean -xdf` inside the example directory to reset environment
**And** each step installs the tarball with `npm i ../../packages/cli/runtime-env-cli-test.tgz`
**And** each step runs `npm ci` to install dependencies
**And** build, preview (vite), and docker steps run builds WITHOUT .env file
**And** `.env` is created with test values (e.g., `FOO=v1`) only AFTER build for runtime interpolation/injection
**And** dev, build, preview (vite), docker steps use Cypress for E2E testing
**And** test step runs `npm run test` directly (no Cypress wrapper)
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
**And** `.env` file is regenerated with required values
**And** `node_modules` and `dist` directories are removed
**And** the environment is in a clean state for the next test

---

### Requirement: Test Infrastructure Setup

The comprehensive examples SHALL provide the necessary Cypress and test infrastructure to support E2E testing.

#### Scenario: Cypress configuration exists

**Given** the comprehensive example directory
**Then** `cypress.config.js` exists with e2e configuration
**And** `cypress/support/e2e.js` exists for global setup
**And** `cypress/support/commands.js` exists for custom commands
**And** `.gitignore` excludes `cypress/screenshots/` and `cypress/videos/`

#### Scenario: Test commands are defined in CI workflow

**Given** the CI workflow file `.github/workflows/ci.yml`
**Then** each test mode has its own CI step with inline commands
**And** commands use `npx cypress run` and `npx start-server-and-test`
**And** no npm scripts are added to `package.json` for E2E tests

#### Scenario: Dependencies are installed

**Given** the comprehensive example `package.json`
**Then** `cypress` version 15.7.1 is in devDependencies
**And** `start-server-and-test` version 2.1.3 is in devDependencies
**And** versions match other examples for consistency

---

### Requirement: Test Execution Independence

Each E2E test mode SHALL run independently in CI without requiring other tests to run first. Tests are executed via inline CI commands, not npm scripts.

#### Scenario: Dev test runs independently in CI

**Given** a clean comprehensive example installation
**When** the CI dev test step executes
**Then** the test starts its own dev server
**And** completes successfully
**And** cleans up the server process

#### Scenario: Build test runs independently in CI

**Given** a clean comprehensive example installation
**When** the CI build test step executes
**Then** the test builds the project
**And** verifies build output
**And** completes successfully

#### Scenario: Preview test runs independently in CI (Vite only)

**Given** a clean comprehensive-vite installation
**When** the CI preview test step executes
**Then** the test builds the project
**And** prepares preview mode
**And** starts preview server
**And** verifies preview functionality
**And** completes successfully

#### Scenario: Tests run in clean environment in CI

**Given** CI is running multiple test modes sequentially
**When** transitioning between test modes
**Then** `git clean -xdf` runs at repository root to remove all untracked files
**And** all `node_modules`, `dist`, and generated files across entire repo are cleaned
**And** artifacts are downloaded fresh from the build job
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
- **Test Modes**: 5 (dev, build, test, preview, docker)

### comprehensive-webpack

- **Dev Server**: webpack-dev-server (port 8080)
- **Test Runner**: Jest
- **PWA Plugin**: workbox-webpack-plugin
- **Service Worker**: `dist/service-worker.js`
- **Test Modes**: 4 (dev, build, test, docker - no preview)

---

## MODIFIED Requirements

None. This change adds new E2E testing capabilities without modifying existing functionality.

---

## REMOVED Requirements

None. No existing requirements are removed.
