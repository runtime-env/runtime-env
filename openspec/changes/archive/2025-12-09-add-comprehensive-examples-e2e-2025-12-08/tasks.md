# Implementation Tasks

## Phase 1: Dependencies & Infrastructure Setup (1-2 hours)

### comprehensive-vite Setup

- [ ] Add `cypress` 15.7.1 to devDependencies
- [ ] Add `start-server-and-test` to devDependencies
- [ ] Create `cypress.config.js` with baseUrl: 'http://localhost:5173'
- [ ] Create `cypress/support/e2e.js` for global setup
- [ ] Add `.gitignore` entries: `cypress/screenshots/`, `cypress/videos/`, `.env`, `dev.log`, `preview.log`

### comprehensive-webpack Setup

- [ ] Add `cypress` 15.7.1 to devDependencies
- [ ] Add `start-server-and-test` to devDependencies
- [ ] Create `cypress.config.js` with baseUrl: 'http://localhost:8080'
- [ ] Create `cypress/support/e2e.js` for global setup
- [ ] Add `.gitignore` entries: `cypress/screenshots/`, `cypress/videos/`, `.env`, `dev.log`

## Phase 2: Dev Mode E2E Tests (2-3 hours)

### comprehensive-vite: cypress/e2e/dev.cy.js

- [ ] Setup: Create initial .env file using cy.writeFile()
- [ ] Test: Visit '/' (server already running via start-server-and-test in CI)
- [ ] Test: Verify page displays runtime-env value from .env
- [ ] Test: Verify page title contains runtime-env value
- [ ] Test: Update .env file using cy.exec('echo "FOO=updated" > .env')
- [ ] Test: Wait for HMR to process change (cy.wait with appropriate timeout)
- [ ] Test: Reload page to see updated value
- [ ] Test: Verify page displays updated value (HMR verification)
- [ ] Test: Verify page title shows updated value
- [ ] CI: Run with `start-server-and-test dev http://localhost:5173 'cypress run --spec cypress/e2e/dev.cy.js'`

### comprehensive-webpack: cypress/e2e/dev.cy.js

- [ ] Setup: Create initial .env file using cy.writeFile()
- [ ] Test: Visit '/' (server already running via start-server-and-test in CI)
- [ ] Test: Verify page displays runtime-env value from .env
- [ ] Test: Verify page title contains runtime-env value
- [ ] Test: Update .env file using cy.exec('echo "FOO=updated" > .env')
- [ ] Test: Wait for HMR to process change (cy.wait with appropriate timeout)
- [ ] Test: Reload page to see updated value
- [ ] Test: Verify page displays updated value (HMR verification)
- [ ] Test: Verify page title shows updated value
- [ ] CI: Run with `start-server-and-test dev http://localhost:8080 'cypress run --spec cypress/e2e/dev.cy.js'`

## Phase 3: Preview Mode E2E Tests (2-3 hours, vite only)

### comprehensive-vite: cypress/e2e/preview.cy.js (first run - initial load)

- [ ] Test: Visit '/' (preview server already running via start-server-and-test in CI)
- [ ] Test: Verify page displays interpolated runtime-env value (not template syntax)
- [ ] Test: Verify page title contains interpolated value
- [ ] Test: Verify service worker loads correctly
- [ ] Test: Verify no console errors
- [ ] CI first run: `npm run build && start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'`

### comprehensive-vite: cypress/e2e/preview-sw.cy.js (second run - SW update)

- [ ] Test: Visit '/' (first load - service worker installs with NEW env values)
- [ ] Test: Reload page (second load - service worker activates)
- [ ] Test: Reload page again (third load - service worker serves updated content)
- [ ] Test: Verify page displays NEW interpolated value
- [ ] Test: Verify page title contains NEW value
- [ ] CI second run: Update .env then run `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview-sw.cy.js'`

## Phase 4: Docker Deployment Tests (2-3 hours)

### comprehensive-vite: cypress/e2e/docker.cy.js (first run - initial load)

- [ ] Test: Visit 'http://localhost:3000' (container already running via start-server-and-test in CI)
- [ ] Test: Verify page displays docker environment value
- [ ] Test: Verify page title contains docker value
- [ ] Test: Verify service worker loads and was patched correctly
- [ ] Test: Verify no console errors
- [ ] CI first run: Build image with `docker build --build-arg FOO=docker-value -t comprehensive-vite .`
- [ ] CI first run: Run with `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-vite' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'`

### comprehensive-vite: cypress/e2e/docker-sw.cy.js (second run - SW update)

- [ ] Test: Visit 'http://localhost:3000' (first load - service worker installs with NEW env values)
- [ ] Test: Reload page (second load - service worker activates)
- [ ] Test: Reload page again (third load - service worker serves updated content)
- [ ] Test: Verify page displays NEW docker environment value
- [ ] Test: Verify page title contains NEW value
- [ ] CI second run: Build image with `docker build --build-arg FOO=docker-updated -t comprehensive-vite .`
- [ ] CI second run: Run with `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-vite' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'`

### comprehensive-webpack: cypress/e2e/docker.cy.js (first run - initial load)

- [ ] Test: Visit 'http://localhost:3000' (container already running via start-server-and-test in CI)
- [ ] Test: Verify page displays docker environment value
- [ ] Test: Verify page title contains docker value
- [ ] Test: Verify service worker loads and was patched correctly
- [ ] Test: Verify no console errors
- [ ] CI first run: Build image with `docker build --build-arg FOO=docker-value -t comprehensive-webpack .`
- [ ] CI first run: Run with `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-webpack' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'`

### comprehensive-webpack: cypress/e2e/docker-sw.cy.js (second run - SW update)

- [ ] Test: Visit 'http://localhost:3000' (first load - service worker installs with NEW env values)
- [ ] Test: Reload page (second load - service worker activates)
- [ ] Test: Reload page again (third load - service worker serves updated content)
- [ ] Test: Verify page displays NEW docker environment value
- [ ] Test: Verify page title contains NEW value
- [ ] CI second run: Build image with `docker build --build-arg FOO=docker-updated -t comprehensive-webpack .`
- [ ] CI second run: Run with `start-server-and-test 'docker run -p 3000:80 --rm comprehensive-webpack' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'`

## Phase 5: Documentation (1-2 hours)

- [ ] Update comprehensive-vite README.md with E2E test documentation
- [ ] Document npm scripts: test:e2e:dev, test:e2e:preview, test:e2e:preview:sw, test:e2e:docker
- [ ] Explain start-server-and-test usage pattern
- [ ] Explain preview mode two-step approach (initial test + SW update test)
- [ ] Update comprehensive-webpack README.md with E2E test documentation
- [ ] Document npm scripts: test:e2e:dev, test:e2e:docker
- [ ] Document prerequisites (Cypress, start-server-and-test, Docker)

## Phase 6: CI Integration (2-3 hours)

### comprehensive-vite CI Steps

- [ ] Add "Test examples/comprehensive-vite (dev)" step:
  - cd examples/comprehensive-vite
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - echo "FOO=dev-value" > .env
  - start-server-and-test dev http://localhost:5173 'cypress run --spec cypress/e2e/dev.cy.js'
- [ ] Add "Test examples/comprehensive-vite (test)" step:
  - git clean -xdf (inside example dir)
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - npm run test
- [ ] Add "Test examples/comprehensive-vite (preview - initial)" step:
  - git clean -xdf (inside example dir)
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - npm run build
  - echo "FOO=preview-value" > .env
  - start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'
- [ ] Add "Test examples/comprehensive-vite (preview - SW update)" step:
  - echo "FOO=preview-updated" > .env
  - start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview-sw.cy.js'
- [ ] Add "Test examples/comprehensive-vite (docker - initial)" step:
  - git clean -xdf (inside example dir)
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - docker build --build-arg FOO=docker-value -t comprehensive-vite .
  - start-server-and-test 'docker run -p 3000:80 --rm comprehensive-vite' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'
- [ ] Add "Test examples/comprehensive-vite (docker - SW update)" step:
  - docker build --build-arg FOO=docker-updated -t comprehensive-vite .
  - start-server-and-test 'docker run -p 3000:80 --rm comprehensive-vite' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'

### comprehensive-webpack CI Steps

- [ ] Add "Test examples/comprehensive-webpack (dev)" step:
  - cd examples/comprehensive-webpack
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - echo "FOO=dev-value" > .env
  - start-server-and-test dev http://localhost:8080 'cypress run --spec cypress/e2e/dev.cy.js'
- [ ] Add "Test examples/comprehensive-webpack (test)" step:
  - git clean -xdf (inside example dir)
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - npm run test
- [ ] Add "Test examples/comprehensive-webpack (docker - initial)" step:
  - git clean -xdf (inside example dir)
  - npm ci
  - npm install ../../packages/cli/runtime-env-cli-test.tgz
  - docker build --build-arg FOO=docker-value -t comprehensive-webpack .
  - start-server-and-test 'docker run -p 3000:80 --rm comprehensive-webpack' http://localhost:3000 'cypress run --spec cypress/e2e/docker.cy.js'
- [ ] Add "Test examples/comprehensive-webpack (docker - SW update)" step:
  - docker build --build-arg FOO=docker-updated -t comprehensive-webpack .
  - start-server-and-test 'docker run -p 3000:80 --rm comprehensive-webpack' http://localhost:3000 'cypress run --spec cypress/e2e/docker-sw.cy.js'

## Phase 7: Validation & Cleanup (1-2 hours)

### Local Testing

- [ ] Run comprehensive-vite dev tests locally with inline command
- [ ] Run comprehensive-vite test mode locally (npm run test)
- [ ] Run comprehensive-vite preview tests locally with inline command (twice)
- [ ] Run comprehensive-vite docker tests locally with inline command (twice)
- [ ] Run comprehensive-webpack dev tests locally with inline command
- [ ] Run comprehensive-webpack test mode locally (npm run test)
- [ ] Run comprehensive-webpack docker tests locally with inline command (twice)

### Final Checks

- [ ] Verify tests are deterministic (can run multiple times)
- [ ] Verify git clean -xdf properly resets environment between tests in CI
- [ ] Verify no artifacts interfere between test modes
- [ ] Verify tarball installation works correctly
- [ ] Verify Docker cleanup works properly (no orphaned containers)
- [ ] Verify start-server-and-test properly starts and stops servers
- [ ] Check test output for clear error messages

### Code Review Prep

- [ ] Review all test code for clarity and maintainability
- [ ] Ensure consistent style with other example tests
- [ ] Add comments for complex test logic (e.g., SW update reload sequence)
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
