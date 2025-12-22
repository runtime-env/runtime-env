# Spec: Simplify Comprehensive Examples (Remove PWA)

## Context

This spec removes Progressive Web App (PWA) functionality from comprehensive-vite and comprehensive-webpack examples. The examples will focus solely on demonstrating runtime environment variable injection across different deployment modes without the added complexity of service workers and cache busting.

This change modifies requirements from `add-comprehensive-examples-e2e-2025-12-08` by removing service worker update test scenarios and simplifying preview/docker test workflows.

---

## Purpose

Simplify the comprehensive examples by removing PWA/service-worker complexity so the examples focus on runtime-env core behaviors.

## Requirements

### Requirement: Preview Mode "Build Once, Deploy Anywhere" Verification (Vite only)

The comprehensive-vite example SHALL verify that the production build can serve different environment variable values without rebuilding. This validates the core "build once, deploy anywhere" principle by reusing the same build artifacts with different .env files.

#### Scenario: Preview serves updated env values without rebuild

**Given** the production build is created with `npm run build` WITHOUT .env
**And** `.env` file is created with `FOO=preview-initial`
**And** `npm run preview` is executed and serves the page successfully
**And** Cypress test runs with `--env EXPECTED_FOO=preview-initial` flag
**And** the page displays "preview-initial"
**And** the preview server is terminated
**When** the `.env` file is modified to `FOO=preview-updated`
**And** the production build is NOT recreated (same dist/ directory)
**And** `npm run preview` is executed again
**And** Cypress test visits `http://localhost:4173` with `--env EXPECTED_FOO=preview-updated` flag
**Then** the page displays "preview-updated" (not "preview-initial")
**And** the page title contains "preview-updated"
**And** this demonstrates runtime-env can inject different values into the same build

---

### Requirement: Docker "Build Once, Deploy Anywhere" Verification

The comprehensive examples SHALL verify that the Docker image can serve different environment variable values without rebuilding the image. This validates the core "build once, deploy anywhere" principle by reusing the same image with different environment variables.

#### Scenario: Docker serves updated env values without rebuild

**Given** the Docker image has been built once with `docker build -t comprehensive-{vite|webpack} .`
**When** a container is started with `docker run -p 3000:80 -e FOO=docker-initial comprehensive-{vite|webpack}`
**And** Cypress test runs with `--env EXPECTED_FOO=docker-initial` flag
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-initial"
**And** the container is stopped and removed
**When** a new container is started with the SAME image but different env: `docker run -p 3000:80 -e FOO=docker-updated comprehensive-{vite|webpack}`
**And** Cypress test runs with `--env EXPECTED_FOO=docker-updated` flag
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-updated" (not "docker-initial")
**And** the page title contains "docker-updated"
**And** this demonstrates the image is environment-agnostic and can be deployed with any env values

### Requirement: E2E Tests Use Dynamic Expected Values

The comprehensive example E2E tests SHALL use Cypress environment variables to dynamically determine expected values instead of hardcoding them. This enables the same test file to verify multiple environment configurations in the "build once, deploy anywhere" dual-run pattern.

#### Scenario: E2E test reads expected value from Cypress environment

**Given** an E2E test file (`preview.cy.js` or `docker.cy.js`) needs to verify runtime environment injection
**When** the test is executed with `cypress run --env EXPECTED_FOO=<value>`
**And** the test code calls `Cypress.env("EXPECTED_FOO")`
**Then** the test receives the value passed via the `--env` flag
**And** the test uses this value to assert against the actual page content
**And** the same test file can be run multiple times with different expected values

#### Scenario: CI passes different expected values for dual-run tests

**Given** the CI workflow runs dual-run tests (preview or docker mode)
**When** the first test run executes with `--env EXPECTED_FOO=preview-initial` (or `docker-initial`)
**Then** the test verifies the page displays "preview-initial" (or "docker-initial")
**When** the second test run executes with `--env EXPECTED_FOO=preview-updated` (or `docker-updated`)
**Then** the test verifies the page displays "preview-updated" (or "docker-updated")
**And** both runs use the identical test file without modification
**And** this pattern eliminates the need for separate test files per environment value

---

\*\*\* End Patch

---

### Requirement: Refactor Comprehensive Vite Example

The `comprehensive-vite` example SHALL be refactored to use the new `@runtime-env/vite-plugin` plugin, serving as a best-practice reference for users, and its `package.json` scripts SHALL be simplified.

#### Scenario: `comprehensive-vite` `package.json` scripts are simplified

- **GIVEN** the `comprehensive-vite` example.
- **WHEN** a developer inspects `package.json` scripts.
- **THEN** the `pretest` script SHALL NOT be present.
- **AND** the `test` script SHALL execute `vitest --run`.

## ADDED Requirements

### Requirement: Preview Mode "Build Once, Deploy Anywhere" Verification (Vite only)

The comprehensive-vite example SHALL verify that the production build can serve different environment variable values without rebuilding. This validates the core "build once, deploy anywhere" principle by reusing the same build artifacts with different .env files.

#### Scenario: Preview serves updated env values without rebuild

**Given** the production build is created with `npm run build` WITHOUT .env
**And** `.env` file is created with `FOO=preview-initial`
**And** `npm run preview` is executed and serves the page successfully
**And** Cypress test runs with `--env EXPECTED_FOO=preview-initial` flag
**And** the page displays "preview-initial"
**And** the preview server is terminated
**When** the `.env` file is modified to `FOO=preview-updated`
**And** the production build is NOT recreated (same dist/ directory)
**And** `npm run preview` is executed again
**And** Cypress test visits `http://localhost:4173` with `--env EXPECTED_FOO=preview-updated` flag
**Then** the page displays "preview-updated" (not "preview-initial")
**And** the page title contains "preview-updated"
**And** this demonstrates runtime-env can inject different values into the same build

---

### Requirement: Docker "Build Once, Deploy Anywhere" Verification

The comprehensive examples SHALL verify that the Docker image can serve different environment variable values without rebuilding the image. This validates the core "build once, deploy anywhere" principle by reusing the same image with different environment variables.

#### Scenario: Docker serves updated env values without rebuild

**Given** the Docker image has been built once with `docker build -t comprehensive-{vite|webpack} .`
**When** a container is started with `docker run -p 3000:80 -e FOO=docker-initial comprehensive-{vite|webpack}`
**And** Cypress test runs with `--env EXPECTED_FOO=docker-initial` flag
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-initial"
**And** the container is stopped and removed
**When** a new container is started with the SAME image but different env: `docker run -p 3000:80 -e FOO=docker-updated comprehensive-{vite|webpack}`
**And** Cypress test runs with `--env EXPECTED_FOO=docker-updated` flag
**And** Cypress test visits `http://localhost:3000`
**Then** the page displays "docker-updated" (not "docker-initial")
**And** the page title contains "docker-updated"
**And** this demonstrates the image is environment-agnostic and can be deployed with any env values

### Requirement: E2E Tests Use Dynamic Expected Values

The comprehensive example E2E tests SHALL use Cypress environment variables to dynamically determine expected values instead of hardcoding them. This enables the same test file to verify multiple environment configurations in the "build once, deploy anywhere" dual-run pattern.

#### Scenario: E2E test reads expected value from Cypress environment

**Given** an E2E test file (`preview.cy.js` or `docker.cy.js`) needs to verify runtime environment injection
**When** the test is executed with `cypress run --env EXPECTED_FOO=<value>`
**And** the test code calls `Cypress.env("EXPECTED_FOO")`
**Then** the test receives the value passed via the `--env` flag
**And** the test uses this value to assert against the actual page content
**And** the same test file can be run multiple times with different expected values

#### Scenario: CI passes different expected values for dual-run tests

**Given** the CI workflow runs dual-run tests (preview or docker mode)
**When** the first test run executes with `--env EXPECTED_FOO=preview-initial` (or `docker-initial`)
**Then** the test verifies the page displays "preview-initial" (or "docker-initial")
**When** the second test run executes with `--env EXPECTED_FOO=preview-updated` (or `docker-updated`)
**Then** the test verifies the page displays "preview-updated" (or "docker-updated")
**And** both runs use the identical test file without modification
**And** this pattern eliminates the need for separate test files per environment value

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

- `workbox-webpack-plugin` dependency and configuration
- Service worker registration in `src/index.ts`
- `scripts/patch-runtime-env-revision.cjs`
- SW update E2E tests: `cypress/e2e/docker-sw.cy.js`
- CI steps for SW update testing
