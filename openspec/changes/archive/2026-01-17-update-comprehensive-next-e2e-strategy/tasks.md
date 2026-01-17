## 1. Infrastructure Setup

- [x] 1.1 Add `start-server-and-test` to `examples/comprehensive-next/package.json` if not already present (ensure version matches `comprehensive-vite`)
- [x] 1.2 Remove any non-standard E2E scripts from `examples/comprehensive-next/package.json` (like `test:dev`, `test:prod`).
- [x] 1.3 Update `examples/comprehensive-next/cypress/e2e/dev.cy.js` to ensure it matches the expected behavior and cleaning.
- [x] 1.4 Create `examples/comprehensive-next/cypress/e2e/preview.cy.js` (matching Vite's preview test pattern, including subsequent start verification).
- [x] 1.5 Create `examples/comprehensive-next/cypress/e2e/docker.cy.js` (including subsequent start verification).

## 2. CI Implementation

- [x] 2.1 Update `.github/workflows/ci.yml` `test-example-next` job:
  - [x] Update Dev step to use inline `start-server-and-test` and `cypress run`.
  - [x] Remove `test:dev` call.
  - [x] Add Preview step to use inline `start-server-and-test` to verify both initial and subsequent starts after `.env` update.
  - [x] Update Docker step to use the same pattern as Vite (build once, run container with `start-server-and-test` for both initial and updated environment variables).
  - [x] Ensure `git clean -xdf` and `git restore .` are used between steps.

## 3. Verification

- [x] 3.1 Run `openspec validate update-comprehensive-next-e2e-strategy --strict`.
