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

*** End Patch

---

## REMOVED Requirements

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

### E2E Test Implementation Pattern

The E2E tests use Cypress environment variables to enable dynamic verification:

```javascript
// Example: preview.cy.js and docker.cy.js
describe("Preview Mode E2E", () => {
  it("serves interpolated content from a single build", () => {
    cy.visit("/");

    // Get expected value from Cypress environment (passed via --env flag in CI)
    const expectedValue = Cypress.env("EXPECTED_FOO");

    // Verify page displays the actual runtime-env value
    cy.get("#app").should("contain", expectedValue);
    cy.title().should("include", expectedValue);
  });
});
```

**Key points:**

- Tests call `Cypress.env("EXPECTED_FOO")` to read the expected value
- CI passes the value via `--env EXPECTED_FOO=<value>` flag
- Same test file verifies both `-initial` and `-updated` runs
- Eliminates hardcoded values and need for separate test files

### Success Criteria

- All remaining E2E tests pass
- CI workflows execute successfully with simplified test matrix
- No service worker registration errors in browser console
- Preview mode successfully serves different env values from the same build
- Docker mode successfully serves different env values from the same image
- "Build once, deploy anywhere" principle is verified without service worker complexity
- Examples remain comprehensive demonstrations of runtime-env core features
- Documentation updated to remove PWA references
- E2E tests use dynamic expected values via `Cypress.env()` pattern
