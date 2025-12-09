# Add E2E Tests for Comprehensive Examples

## Problem Statement

The comprehensive examples (`comprehensive-vite` and `comprehensive-webpack`) currently have unit tests but lack end-to-end tests to verify the complete workflows:

**Both examples need:**

- **Development mode**: Server starts, HTML is interpolated, runtime-env.js is generated, HMR works when .env changes
- **Test mode**: Test runner (Vitest/Jest) runs successfully with runtime-env types and values
- **Docker deployment**: Container deployment with runtime environment injection

**Vite-specific:**

- **Preview mode**: Production build can be served with interpolated values

Unlike simpler examples (development, production, workbox), these comprehensive examples have not been tested in CI, leaving gaps in verification that all modes work correctly together.

## Proposed Solution

Add E2E tests to both `examples/comprehensive-vite` and `examples/comprehensive-webpack` using Cypress best practices (start-server-and-test for server lifecycle, cy.exec() only for file operations):

### Shared Test Patterns

**Server managed externally** (dev, preview, docker):

1. **Dev mode test**:
   - Use `start-server-and-test` npm package to spawn dev server BEFORE Cypress
   - Cypress tests run with server already available
   - Tests use `cy.exec()` to update .env file during test
   - Verify HMR updates the displayed value after .env change
   - `start-server-and-test` kills server automatically after tests complete
   - Ports: vite=5173, webpack=8080

2. **Docker deployment test**:
   - Build docker image in CI step BEFORE running Cypress (one-time setup)
   - Use `start-server-and-test` to manage docker container lifecycle
   - `start-server-and-test` uses inline docker command: `docker run -p 3000:80 --rm comprehensive-{vite|webpack}`
   - Container runs in foreground (no -d flag), waits for http://localhost:3000, runs Cypress
   - Cypress tests verify runtime-env injection at container startup
   - Cypress tests verify service worker patching in container
   - `start-server-and-test` stops container automatically after tests complete (Ctrl+C)
   - For second test with different env, CI rebuilds image with new env, repeats the process

**Direct execution mode** (test):

3. **Test mode verification**:
   - Run `npm run test` directly in CI (no Cypress wrapper)
   - Verify test runner (Vitest/Jest) passes
   - Simpler than wrapping test runners in Cypress

### Vite-Specific Test

**Server managed externally** (preview):

4. **Preview mode test** (vite only):
   - Run `npm run build` WITHOUT .env file in CI step BEFORE Cypress
   - Create .env AFTER build in CI step
   - Use `start-server-and-test preview http://localhost:4173 'cypress run ...'` inline in CI
   - Cypress tests verify page displays interpolated runtime-env value
   - Cypress tests verify service worker loads
   - After first test completes, update .env in CI and run start-server-and-test again
   - Cypress tests verify service worker update by reloading page twice
   - `start-server-and-test` kills server automatically after each test run
   - No extra npm scripts needed (only use top-level `npm run dev`, `npm run build`, `npm run preview`)

### CI Integration

Add CI steps that follow the same pattern as other examples:

- Run in same job after pack (no artifact download needed)
- Install tarball from `../../packages/cli/runtime-env-cli-test.tgz`
- Run `git clean -xdf` inside example directory between test modes
- Run E2E test suite
- Vite: 4 modes (dev, test, preview, docker)
- Webpack: 3 modes (dev, test, docker)

## Success Criteria

- E2E tests follow Cypress best practices (start-server-and-test for all server lifecycle management)
- E2E tests cover all modes with minimal, non-invasive code additions
  - Vite: 4 modes (dev, test, preview, docker)
  - Webpack: 3 modes (dev, test, docker)
- Dev mode uses `start-server-and-test dev` to manage dev server lifecycle
- Preview mode uses `start-server-and-test preview` inline in CI (run twice for SW update test)
- Docker mode uses `start-server-and-test` with inline docker command to manage container lifecycle
- Cypress tests use `cy.exec()` only for .env file updates
- Test mode runs `npm run test` directly (no Cypress wrapper)
- Tests verify HMR functionality in dev mode
- Builds run WITHOUT .env file during preview/docker modes
- Preview/Docker demonstrate runtime-env without rebuilding when env changes
- Docker tests verify production deployment with runtime injection
- CI runs comprehensive example tests in same job after pack (no artifact download)
- Tests use tarball installation from `../../packages/cli/runtime-env-cli-test.tgz`
- `git clean -xdf` runs inside example directory between test modes
- All tests pass in CI
- Docker containers are properly cleaned up after tests
- NO npm scripts added to package.json (only use existing top-level scripts: `dev`, `build`, `preview`, `test`)
- No modifications to existing source code, configs, or application logic

## Out of Scope

- Preview mode for webpack (not implemented in the example)
- Testing without PWA (PWA is core to comprehensive examples)
- Modifying existing scripts or workflows (only adding tests)
- Changes to runtime-env CLI or library code
- Multi-stage Docker optimization (use existing Dockerfile pattern)

## Dependencies

- Cypress 15.7.1 (consistent with other examples)
- `start-server-and-test` npm package (recommended by Cypress documentation)
- Existing build/pack tooling in CI

## Related Changes

None. This is an isolated improvement to test coverage for both comprehensive examples.

## Key Differences Between Examples

| Aspect         | comprehensive-vite | comprehensive-webpack          |
| -------------- | ------------------ | ------------------------------ |
| Dev Server     | Vite (port 5173)   | webpack-dev-server (port 8080) |
| Test Runner    | Vitest             | Jest                           |
| PWA Plugin     | vite-plugin-pwa    | workbox-webpack-plugin         |
| Service Worker | `dist/sw.js`       | `dist/service-worker.js`       |
| Preview Mode   | ✅ Yes             | ❌ No                          |
| Test Modes     | 4                  | 3                              |
