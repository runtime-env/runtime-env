# Implementation Tasks

## Phase 1: Cypress Infrastructure Setup (2-3 hours)

### comprehensive-vite Setup

- [ ] Add `cypress` 15.7.1 and `start-server-and-test` 2.1.3 to devDependencies
- [ ] Create `cypress.config.js` with e2e configuration
- [ ] Create `cypress/support/e2e.js` for global setup
- [ ] Create `cypress/support/commands.js` for custom commands
- [ ] Add `cypress/screenshots/` and `cypress/videos/` to `.gitignore`

### comprehensive-webpack Setup

- [ ] Add `cypress` 15.7.1 and `start-server-and-test` 2.1.3 to devDependencies
- [ ] Create `cypress.config.js` with e2e configuration
- [ ] Create `cypress/support/e2e.js` for global setup
- [ ] Create `cypress/support/commands.js` for custom commands
- [ ] Add `cypress/screenshots/` and `cypress/videos/` to `.gitignore`

## Phase 2: Dev Mode E2E Tests (3-4 hours)

### comprehensive-vite: cypress/e2e/dev.cy.js

- [ ] Test: Visit localhost:5173 (Vite default port)
- [ ] Test: Verify page contains runtime-env value from .env
- [ ] Test: Verify page title contains runtime-env value
- [ ] Test: Update .env file with new value
- [ ] Test: Wait for HMR to reload (with timeout)
- [ ] Test: Verify page displays updated value (HMR test)

### comprehensive-webpack: cypress/e2e/dev.cy.js

- [ ] Test: Visit localhost:8080 (webpack-dev-server default port)
- [ ] Test: Verify page contains runtime-env value from .env
- [ ] Test: Verify page title contains runtime-env value
- [ ] Test: Update .env file with new value
- [ ] Test: Wait for HMR to reload (with timeout)
- [ ] Test: Verify page displays updated value (HMR test)

## Phase 3: Preview Mode E2E Test (2-3 hours, vite only)

### comprehensive-vite: cypress/e2e/preview.cy.js

- [ ] Test: Run `npm run build` via cy.exec() (prerequisite)
- [ ] Test: Run preview:runtime-env:gen-js, interpolate, pwa scripts
- [ ] Test: Visit preview server at localhost:4173
- [ ] Test: Verify page contains interpolated runtime-env value (not template)
- [ ] Test: Verify page title contains interpolated value
- [ ] Test: Verify service worker loads
- [ ] Test: Update .env file with new value
- [ ] Test: Rerun preview preparation scripts
- [ ] Test: Restart preview server
- [ ] Test: Reload page once (service worker installs)
- [ ] Test: Reload page again (service worker activates)
- [ ] Test: Verify page displays new value

## Phase 4: Docker Deployment Tests (3-4 hours)

### comprehensive-vite: cypress/e2e/docker.cy.js

- [ ] Test: Copy tarball to example directory
- [ ] Test: Build Docker image (runtime-env-comprehensive-vite)
- [ ] Test: Verify build completes successfully
- [ ] Test: Run container with environment variable
- [ ] Test: Visit container at localhost:3000
- [ ] Test: Verify page contains runtime-env value from container env
- [ ] Test: Verify page title contains interpolated value
- [ ] Test: Verify service worker loads and was patched
- [ ] Test: Stop and remove container
- [ ] Test: Run container again with different env value
- [ ] Test: Verify new value is displayed (not cached)
- [ ] Test: Clean up all containers

### comprehensive-webpack: cypress/e2e/docker.cy.js

- [ ] Test: Copy tarball to example directory
- [ ] Test: Build Docker image (runtime-env-comprehensive-webpack)
- [ ] Test: Verify build completes successfully
- [ ] Test: Run container with environment variable
- [ ] Test: Visit container at localhost:3000
- [ ] Test: Verify page contains runtime-env value from container env
- [ ] Test: Verify page title contains interpolated value
- [ ] Test: Verify service worker loads and was patched
- [ ] Test: Stop and remove container
- [ ] Test: Run container again with different env value
- [ ] Test: Verify new value is displayed (not cached)
- [ ] Test: Clean up all containers

## Phase 5: Documentation (1-2 hours)

- [ ] Update comprehensive-vite README.md with E2E test documentation
- [ ] Update comprehensive-webpack README.md with E2E test documentation
- [ ] Document how tests are run in CI
- [ ] Document test structure and what each test verifies
- [ ] Document prerequisites (Cypress, Docker)
- [ ] Document key differences between vite and webpack test patterns

## Phase 6: CI Integration (2-3 hours)

### comprehensive-vite CI Steps

- [ ] Add "Test examples/comprehensive-vite (dev)" step
- [ ] Add "Test examples/comprehensive-vite (test)" step with `git clean -xdf`
- [ ] Add "Test examples/comprehensive-vite (preview)" step with `git clean -xdf`
- [ ] Add "Test examples/comprehensive-vite (docker)" step with `git clean -xdf`

### comprehensive-webpack CI Steps

- [ ] Add "Test examples/comprehensive-webpack (dev)" step
- [ ] Add "Test examples/comprehensive-webpack (test)" step with `git clean -xdf`
- [ ] Add "Test examples/comprehensive-webpack (docker)" step with `git clean -xdf`

### CI Configuration

- [ ] Ensure all steps download artifacts from build job
- [ ] Ensure tarball installation pattern is used (not workspace linking)
- [ ] Ensure `git clean -xdf` runs at repository root between test modes
- [ ] Ensure builds run WITHOUT .env file
- [ ] Ensure Docker containers are cleaned up after tests
- [ ] Verify job runs after build and pack steps
- [ ] Verify job uses ubuntu-latest runner
- [ ] Verify job fails if any test fails

## Phase 7: Validation & Cleanup (1-2 hours)

### Final Checks

- [ ] Run all comprehensive-vite tests locally to ensure they pass
- [ ] Run all comprehensive-webpack tests locally to ensure they pass
- [ ] Verify tests are deterministic (can run multiple times)
- [ ] Check test output for clear error messages
- [ ] Verify git clean -xdf properly resets environment between tests
- [ ] Verify no artifacts interfere between test modes
- [ ] Verify tarball installation works correctly
- [ ] Verify Docker cleanup works properly

### Code Review Prep

- [ ] Review all test code for clarity and maintainability
- [ ] Ensure consistent style with other example tests
- [ ] Add comments for complex test logic
- [ ] Verify package.json changes are minimal and correct
- [ ] Ensure vite and webpack patterns are consistent where applicable

## Dependencies Between Tasks

- Phase 2-4 can be developed in parallel after Phase 1
- Phase 5 depends on Phases 2-4
- Phase 6 depends on Phases 2-5
- Phase 7 is final validation after Phase 6

## Estimated Total Time

- **Minimum**: 14 hours (if everything goes smoothly, reusing patterns)
- **Expected**: 18 hours (with debugging and iterations)
- **Maximum**: 24 hours (with unforeseen issues or significant differences)

## Notes

- comprehensive-vite has 4 test modes (includes preview)
- comprehensive-webpack has 3 test modes (no preview)
- Build verification removed - preview/docker modes will catch build issues
- Ports differ: vite=5173, webpack=8080
- Service worker files differ: vite=sw.js, webpack=service-worker.js
- Test runners differ: vite=Vitest, webpack=Jest
