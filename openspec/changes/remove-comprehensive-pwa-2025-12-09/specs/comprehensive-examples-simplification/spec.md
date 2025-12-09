# Spec: Simplify Comprehensive Examples (Remove PWA)

## Context

This spec removes Progressive Web App (PWA) functionality from comprehensive-vite and comprehensive-webpack examples. The examples will focus solely on demonstrating runtime environment variable injection across different deployment modes without the added complexity of service workers and cache busting.

This change modifies requirements from `add-comprehensive-examples-e2e-2025-12-08` by removing service worker update test scenarios and simplifying preview/docker test workflows.

---

## ADDED Requirements

### Requirement: Preview Mode "Build Once, Deploy Anywhere" Verification (Vite only)

The comprehensive-vite example SHALL verify that the production build can serve different environment variable values without rebuilding. This validates the core "build once, deploy anywhere" principle by reusing the same build artifacts with different .env files.

#### Scenario: Preview serves updated env values without rebuild

**Given** the production build is created with `npm run build` WITHOUT .env
**And** `.env` file is created with `FOO=preview-initial`
**And** `npm run preview` is executed and serves the page successfully
**And** the page displays "preview-initial"
**And** the preview server is terminated
**When** the `.env` file is modified to `FOO=preview-updated`
**And** the production build is NOT recreated (same dist/ directory)
**And** `npm run preview` is executed again
**And** Cypress test visits `http://localhost:4173`
**Then** the page displays "preview-updated" (not "preview-initial")
**And** the page title contains "preview-updated"
**And** this demonstrates runtime-env can inject different values into the same build

---

### Requirement: Docker "Build Once, Deploy Anywhere" Verification

The comprehensive examples SHALL verify that the Docker image can serve different environment variable values without rebuilding the image. This validates the core "build once, deploy anywhere" principle by reusing the same image with different environment variables.

#### Scenario: Docker serves updated env values without rebuild

**Given** the Docker image has been built once with `docker build -t comprehensive-{vite|webpack} .`
**When** a container is started with `docker run -p 3000:80 -e FOO=docker-initial comprehensive-{vite|webpack}`
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-initial"
**And** the container is stopped and removed
**When** a new container is started with the SAME image but different env: `docker run -p 3000:80 -e FOO=docker-updated comprehensive-{vite|webpack}`
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-updated" (not "docker-initial")
**And** the page title contains "docker-updated"
**And** this demonstrates the image is environment-agnostic and can be deployed with any env values

---

## MODIFIED Requirements

### Requirement: Preview Mode E2E Verification (Vite only)

The comprehensive-vite example SHALL provide E2E tests that verify the preview server serves the production build with interpolated runtime environment values. Following "build once, deploy anywhere" workflow, the build runs gen-ts only (preserving templates), then the deploy stage runs gen-js + interpolate.

#### Scenario: Preview server serves interpolated content

**Given** the production build is created with `npm run build` WITHOUT .env
**When** `.env` file is created AFTER build (deploy stage simulation)
**And** `npm run preview` is executed via start-server-and-test
**And** Cypress test in `cypress/e2e/preview.cy.js` visits `http://localhost:4173`
**Then** the page displays the actual runtime-env value
**And** the page title contains the actual runtime-env value
**And** no console errors are present

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
**And** no console errors are present

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
**And** each step runs `git clean -xdf` and `git restore .` inside the example directory to reset environment
**And** each step runs `npm ci` to install dependencies
**And** each step (except docker) installs the tarball with `npm i ../../packages/cli/runtime-env-cli-test.tgz`
**And** docker copies the tarball into the build context for installation in the Dockerfile
**And** dev mode: creates .env then runs inline `start-server-and-test dev http://localhost:{5173|8080} 'cypress run --spec cypress/e2e/dev.cy.js'`
**And** test mode: creates .env then runs `npm run test` directly (no Cypress wrapper)
**And** preview (vite): builds once with `npm run build`, then runs two sequential tests with different .env values to verify "build once, deploy anywhere"
**And** preview test runs: `echo "FOO=preview-initial" > .env` then `start-server-and-test preview http://localhost:4173 'cypress run --config baseUrl=http://localhost:4173 --spec cypress/e2e/preview.cy.js'` then `echo "FOO=preview-updated" > .env` then `start-server-and-test preview http://localhost:4173 'cypress run --config baseUrl=http://localhost:4173 --spec cypress/e2e/preview.cy.js'` (same test file, different env)
**And** docker: builds image once, then runs two sequential tests with different env values to verify "build once, deploy anywhere"
**And** docker test runs: `docker build -t comprehensive-{vite|webpack} .` then `start-server-and-test 'docker run -p 3000:80 -e FOO=docker-initial comprehensive-{vite|webpack}' 3000 'cypress run --config baseUrl=http://localhost:3000 --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-{vite|webpack} -q | xargs docker rm -f` then `start-server-and-test 'docker run -p 3000:80 -e FOO=docker-updated comprehensive-{vite|webpack}' 3000 'cypress run --config baseUrl=http://localhost:3000 --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-{vite|webpack} -q | xargs docker rm -f` (same test file, different env)
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
**And** `git restore .` is executed to restore all tracked files to their committed state
**And** the tarball at `../../packages/cli/runtime-env-cli-test.tgz` remains available (outside example directory)
**And** `.env` file is regenerated based on test mode requirements
**And** `node_modules` and `dist` directories are removed (untracked)
**And** generated files (`runtime-env.js`, `runtime-env.d.ts`) are removed (untracked)
**And** modified tracked files like test files are restored to original state
**And** the environment is in a completely clean state for the next test
**And** each test mode can run its appropriate workflow (dev/test/preview/docker)

---

## REMOVED Requirements

### Requirement: Service Worker Update Verification

The following scenarios and test files are REMOVED from the comprehensive examples:

- ❌ Preview service worker updates with new env values (tested in `preview-sw.cy.js`)
- ❌ Docker container patches service worker
- ❌ Docker service worker updates with new env values (tested in `docker-sw.cy.js`)

**Rationale**: Service worker functionality adds significant complexity that distracts from the core runtime-env value proposition. The existing `examples/workbox` already demonstrates PWA integration for users who need it.

**Note**: The `-sw` suffix in test file names stood for "service worker". These files (`preview-sw.cy.js`, `docker-sw.cy.js`) will be deleted. The "build once, deploy anywhere" capability is now verified by running the existing test files (`preview.cy.js`, `docker.cy.js`) twice with different environment values, eliminating the need for separate service worker-specific test files.

---

## Implementation Notes

### Files to Remove

**comprehensive-vite:**

- `cypress/e2e/preview-sw.cy.js` (service worker update test - no longer needed)
- `cypress/e2e/docker-sw.cy.js` (service worker update test - no longer needed)
- `scripts/patch-runtime-env-revision.cjs` (service worker cache busting script)
- Service worker registration code in `src/main.ts`
- `vite-plugin-pwa` dependency and configuration

**comprehensive-webpack:**

- `cypress/e2e/docker-sw.cy.js` (service worker update test - no longer needed)
- `scripts/patch-runtime-env-revision.cjs` (service worker cache busting script)
- Service worker registration code in `src/index.ts`
- `workbox-webpack-plugin` dependency and configuration

**Note**: The `-sw` suffix stood for "service worker". These test files verified that service worker caches updated when environment variables changed. This verification is now accomplished by running the existing `preview.cy.js` and `docker.cy.js` test files twice with different environment values.

### CI Workflow Changes

**comprehensive-vite:**

- **Preview**: Single CI step that builds once, then runs the same test file (`preview.cy.js`) twice with different .env values to verify "build once, deploy anywhere"
  - **Previous**: 2 separate CI steps running different test files: `preview.cy.js` (initial test) and `preview-sw.cy.js` (service worker update test)
  - **New**: 1 CI step running `preview.cy.js` twice: first with `FOO=preview-initial`, then with `FOO=preview-updated`

- **Docker**: Single CI step that builds image once, then runs the same test file (`docker.cy.js`) twice with different env variables to verify "build once, deploy anywhere"
  - **Previous**: 2 separate CI steps running different test files: `docker.cy.js` (initial test) and `docker-sw.cy.js` (service worker update test)
  - **New**: 1 CI step running `docker.cy.js` twice: first with `FOO=docker-initial`, then with `FOO=docker-updated`

**comprehensive-webpack:**

- **Docker**: Single CI step that builds image once, then runs the same test file (`docker.cy.js`) twice with different env variables to verify "build once, deploy anywhere"
  - **Previous**: 2 separate CI steps running different test files: `docker.cy.js` (initial test) and `docker-sw.cy.js` (service worker update test)
  - **New**: 1 CI step running `docker.cy.js` twice: first with `FOO=docker-initial`, then with `FOO=docker-updated`

**Rationale**: The `-sw.cy.js` files (where `-sw` = "service worker") were needed to verify service worker cache updates. Without service workers, we can verify "build once, deploy anywhere" by simply running the same test file twice with different environment values.

### Test Count Updates

**comprehensive-vite:**

- Dev: 1 E2E test file (unchanged)
- Test: 1 test suite (unchanged)
- Preview: 1 E2E test file (`preview.cy.js`) run twice with different .env values
  - **Removed**: `preview-sw.cy.js` (the `-sw` stood for "service worker")
- Docker: 1 E2E test file (`docker.cy.js`) run twice with different env variables
  - **Removed**: `docker-sw.cy.js` (the `-sw` stood for "service worker")

**comprehensive-webpack:**

- Dev: 1 E2E test file (unchanged)
- Test: 1 test suite (unchanged)
- Docker: 1 E2E test file (`docker.cy.js`) run twice with different env variables
  - **Removed**: `docker-sw.cy.js` (the `-sw` stood for "service worker")

### Success Criteria

- All remaining E2E tests pass
- CI workflows execute successfully with simplified test matrix
- No service worker registration errors in browser console
- Preview mode successfully serves different env values from the same build
- Docker mode successfully serves different env values from the same image
- "Build once, deploy anywhere" principle is verified without service worker complexity
- Examples remain comprehensive demonstrations of runtime-env core features
- Documentation updated to remove PWA references
