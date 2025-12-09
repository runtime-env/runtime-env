# Tasks: Remove PWA Implementation from Comprehensive Examples

## Overview

Remove all Progressive Web App (PWA) functionality from comprehensive-vite and comprehensive-webpack examples to simplify focus on core runtime-env capabilities.

---

## Task List

### Phase 1: Remove comprehensive-vite PWA Components

#### Task 1.1: Remove vite-plugin-pwa dependency

**Estimated time**: 5 min
**Dependencies**: None

- Remove `vite-plugin-pwa` from `examples/comprehensive-vite/package.json`
- Run `npm install` to update lockfile

**Acceptance criteria**:

- Package.json does not reference vite-plugin-pwa
- npm install completes successfully

---

#### Task 1.2: Remove VitePWA plugin from vite.config.ts

**Estimated time**: 5 min
**Dependencies**: 1.1

- Remove VitePWA import statement
- Remove VitePWA plugin from plugins array
- Remove PWA-related configuration

**Acceptance criteria**:

- vite.config.ts does not import or use VitePWA
- Config file remains valid TypeScript

---

#### Task 1.3: Remove service worker registration from main.ts

**Estimated time**: 5 min
**Dependencies**: None

- Remove navigator.serviceWorker.register() call
- Remove related imports/comments

**Acceptance criteria**:

- main.ts does not register service workers
- Application still initializes correctly

---

#### Task 1.4: Delete service worker patch script

**Estimated time**: 2 min
**Dependencies**: None

- Delete `examples/comprehensive-vite/scripts/patch-runtime-env-revision.cjs`
- Delete scripts/ directory if empty

**Acceptance criteria**:

- patch-runtime-env-revision.cjs no longer exists

---

#### Task 1.5: Remove preview:runtime-env:pwa npm script

**Estimated time**: 2 min
**Dependencies**: 1.4

- Remove `preview:runtime-env:pwa` script from package.json
- Update any documentation referencing this script

**Acceptance criteria**:

- Script removed from package.json
- npm run preview:runtime-env:pwa fails with "not found"

---

#### Task 1.6: Delete service worker E2E tests

**Estimated time**: 5 min
**Dependencies**: None

- Delete `examples/comprehensive-vite/cypress/e2e/preview-sw.cy.js` (the `-sw` stands for "service worker")
- Delete `examples/comprehensive-vite/cypress/e2e/docker-sw.cy.js` (the `-sw` stands for "service worker")

**Acceptance criteria**:

- Service worker test files (`*-sw.cy.js`) no longer exist
- Existing test files (`preview.cy.js`, `docker.cy.js`) remain unchanged
- Cypress test directory remains valid

**Note**: The remaining test files will be run twice with different environment values to verify "build once, deploy anywhere" without needing separate SW test files.

---

#### Task 1.7: Update comprehensive-vite README

**Estimated time**: 15 min
**Dependencies**: 1.1-1.6

- Remove PWA-related sections
- Remove service worker mentions from test mode documentation
- Update npm scripts documentation (remove preview:runtime-env:pwa)
- Update CI/CD workflow description (remove SW test steps)

**Acceptance criteria**:

- README has no PWA/service worker mentions
- Documentation accurately reflects simplified example
- All script references are valid

---

### Phase 2: Remove comprehensive-webpack PWA Components

#### Task 2.1: Remove workbox-webpack-plugin dependency

**Estimated time**: 5 min
**Dependencies**: None

- Remove `workbox-webpack-plugin` from `examples/comprehensive-webpack/package.json`
- Run `npm install` to update lockfile

**Acceptance criteria**:

- Package.json does not reference workbox-webpack-plugin
- npm install completes successfully

---

#### Task 2.2: Remove Workbox plugin from webpack.config.js

**Estimated time**: 10 min
**Dependencies**: 2.1

- Remove InjectManifest import statement
- Remove InjectManifest plugin from plugins array
- Remove related configuration

**Acceptance criteria**:

- webpack.config.js does not import or use Workbox
- Config file remains valid JavaScript
- Webpack build completes successfully

---

#### Task 2.3: Remove service worker registration from index.ts

**Estimated time**: 5 min
**Dependencies**: None

- Remove navigator.serviceWorker.register() call
- Remove related imports/comments

**Acceptance criteria**:

- index.ts does not register service workers
- Application still initializes correctly

---

#### Task 2.4: Delete service worker source file

**Estimated time**: 2 min
**Dependencies**: 2.2, 2.3

- Delete `examples/comprehensive-webpack/src/service-worker.js` if exists

**Acceptance criteria**:

- service-worker.js no longer exists
- Webpack build completes without errors

---

#### Task 2.5: Delete service worker patch script

**Estimated time**: 2 min
**Dependencies**: None

- Delete `examples/comprehensive-webpack/scripts/patch-runtime-env-revision.cjs`
- Delete scripts/ directory if empty

**Acceptance criteria**:

- patch-runtime-env-revision.cjs no longer exists

---

#### Task 2.6: Delete service worker E2E tests

**Estimated time**: 5 min
**Dependencies**: None

- Delete `examples/comprehensive-webpack/cypress/e2e/docker-sw.cy.js` (the `-sw` stands for "service worker")

**Acceptance criteria**:

- Service worker test file (`docker-sw.cy.js`) no longer exists
- Existing test file (`docker.cy.js`) remains unchanged
- Cypress test directory remains valid

**Note**: The remaining test file will be run twice with different environment values to verify "build once, deploy anywhere" without needing a separate SW test file.

---

#### Task 2.7: Update comprehensive-webpack README

**Estimated time**: 15 min
**Dependencies**: 2.1-2.6

- Remove PWA support section
- Remove service worker mentions from test mode documentation
- Update webpack configuration documentation
- Update CI/CD workflow description (remove SW test steps)
- Remove Workbox references

**Acceptance criteria**:

- README has no PWA/service worker mentions
- Documentation accurately reflects simplified example
- All configuration references are valid

---

### Phase 3: Update CI Workflows

#### Task 3.1: Update comprehensive-vite CI

**Estimated time**: 15 min
**Dependencies**: 1.6

- Update preview test step to run `preview.cy.js` twice with different .env values
- First run: `echo "FOO=preview-initial" > .env` then run preview.cy.js
- Second run: `echo "FOO=preview-updated" > .env` then run preview.cy.js (verifies "build once, deploy anywhere")
- Update docker test step to run `docker.cy.js` twice with different env variables
- First run: `docker run -e FOO=docker-initial` then run docker.cy.js
- Second run: `docker run -e FOO=docker-updated` then run docker.cy.js (verifies "build once, deploy anywhere")
- Remove references to `preview-sw.cy.js` and `docker-sw.cy.js` (the `-sw` stood for "service worker")

**Acceptance criteria**:

- CI workflow runs successfully
- Preview test runs same test file twice with different .env values
- Docker test runs same test file twice with different env variables
- "Build once, deploy anywhere" is verified without service workers

---

#### Task 3.2: Update comprehensive-webpack CI

**Estimated time**: 15 min
**Dependencies**: 2.6

- Update docker test step to run `docker.cy.js` twice with different env variables
- First run: `docker run -e FOO=docker-initial` then run docker.cy.js
- Second run: `docker run -e FOO=docker-updated` then run docker.cy.js (verifies "build once, deploy anywhere")
- Remove references to `docker-sw.cy.js` (the `-sw` stood for "service worker")

**Acceptance criteria**:

- CI workflow runs successfully
- Docker test runs same test file twice with different env variables
- "Build once, deploy anywhere" is verified without service workers

---

### Phase 4: Verification

#### Task 4.1: Verify comprehensive-vite builds and tests

**Estimated time**: 20 min
**Dependencies**: 1.7, 3.1

- Run `npm install`
- Run `npm run build`
- Run `npm test`
- Run E2E tests locally with "build once, deploy anywhere" verification:
  - Preview: Run preview.cy.js with FOO=preview-initial, then with FOO=preview-updated (no rebuild)
  - Docker: Run docker.cy.js with FOO=docker-initial, then with FOO=docker-updated (no rebuild)
- Verify dev mode still works

**Acceptance criteria**:

- All builds complete successfully
- All tests pass
- Preview mode serves different env values from same build
- Docker mode serves different env values from same image
- No PWA/service worker errors in console

---

#### Task 4.2: Verify comprehensive-webpack builds and tests

**Estimated time**: 20 min
**Dependencies**: 2.7, 3.2

- Run `npm install`
- Run `npm run build`
- Run `npm test`
- Run E2E tests locally with "build once, deploy anywhere" verification:
  - Docker: Run docker.cy.js with FOO=docker-initial, then with FOO=docker-updated (no rebuild)
- Verify dev mode still works

**Acceptance criteria**:

- All builds complete successfully
- All tests pass
- Docker mode serves different env values from same image
- No PWA/service worker errors in console

---

#### Task 4.3: Verify Docker deployments

**Estimated time**: 20 min
**Dependencies**: 4.1, 4.2

- Build comprehensive-vite Docker image
- Run comprehensive-vite container and verify functionality
- Build comprehensive-webpack Docker image
- Run comprehensive-webpack container and verify functionality

**Acceptance criteria**:

- Docker images build successfully
- Containers run without errors
- Runtime environment injection works correctly
- No service worker registration errors

---

#### Task 4.4: Run full CI pipeline

**Estimated time**: 30 min
**Dependencies**: 4.1, 4.2, 4.3

- Commit all changes
- Push to test branch
- Monitor CI execution
- Verify all jobs pass

**Acceptance criteria**:

- CI pipeline completes successfully
- All test jobs pass
- No PWA-related failures

---

### Phase 5: Update Specifications

#### Task 5.1: Update comprehensive-examples-e2e spec

**Estimated time**: 30 min
**Dependencies**: 4.4

- Remove service worker update test scenarios
- Add new scenarios verifying "build once, deploy anywhere" without service workers
- Update CI workflow to run same test files twice with different env values
- Remove SW verification requirements from docker/preview scenarios
- Update design.md if needed

**Acceptance criteria**:

- Spec accurately reflects implementation without PWA
- All scenario references to service workers removed
- New "build once, deploy anywhere" verification scenarios added
- CI workflow documentation updated for dual-run approach

---

## Summary

**Total estimated time**: ~4 hours

**Critical path**:
1.1 → 1.2 → 1.7 → 3.1 → 4.1 → 4.3 → 4.4 → 5.1

**Verification checkpoints**:

- After Phase 1: comprehensive-vite builds and runs
- After Phase 2: comprehensive-webpack builds and runs
- After Phase 3: CI workflows execute correctly with dual-run "build once, deploy anywhere" tests
- After Phase 4: All verification passes including new deployment scenarios
- After Phase 5: Specs updated and validated

**Key Testing Changes**:

- Preview tests: Run `preview.cy.js` twice (initial → updated) to verify same build serves different env values
- Docker tests: Run `docker.cy.js` twice (initial → updated) to verify same image serves different env values
- This replaces the previous approach of separate service worker test files (`preview-sw.cy.js`, `docker-sw.cy.js` where `-sw` = "service worker")
- The existing test files (`preview.cy.js`, `docker.cy.js`) remain unchanged; only the CI workflow execution strategy changes
