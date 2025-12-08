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

Add E2E tests to both `examples/comprehensive-vite` and `examples/comprehensive-webpack` that verify (minimal code additions only):

### Shared Test Patterns

**Cypress-wrapped modes** (dev, docker):

1. **Dev mode test**:
   - Cypress uses `cy.exec('npm run dev')` to start dev server
   - Verify page displays runtime-env value
   - Update .env file during test
   - Verify HMR updates the displayed value
   - If npm run dev fails, Cypress test fails
   - Ports: vite=5173, webpack=8080

2. **Docker deployment test**:
   - Cypress uses `cy.exec('docker build ...')` to build image (NO .env during build)
   - Cypress uses `cy.exec('docker run ...')` to run container with environment variables
   - Verify runtime-env injection at container startup
   - Verify service worker patching in container
   - Restart container with different env values (NO image rebuild)
   - Cypress uses `cy.exec('docker stop/rm ...')` to clean up
   - If any docker command fails, Cypress test fails

**Direct execution mode** (test): 3. **Test mode verification**:

- Run `npm run test` directly in CI (no Cypress wrapper)
- Verify test runner (Vitest/Jest) passes
- Simpler than wrapping test runners in Cypress

### Vite-Specific Test

**Cypress-wrapped mode** (preview): 4. **Preview mode test** (vite only):

- Cypress uses `cy.exec('npm run build')` WITHOUT .env file
- Create .env AFTER build
- Cypress uses `cy.exec('npm run preview')` to start preview server
- Verify page displays interpolated runtime-env value
- Verify service worker is patched correctly
- Restart preview with different env values (NO rebuild)
- If npm run build or npm run preview fails, Cypress test fails

### CI Integration

Add CI steps that follow the same pattern as other examples:

- Run in same job after pack (no artifact download needed)
- Install tarball from `../../packages/cli/runtime-env-cli-test.tgz`
- Run `git clean -xdf` inside example directory between test modes
- Run E2E test suite
- Vite: 4 modes (dev, test, preview, docker)
- Webpack: 3 modes (dev, test, docker)

## Success Criteria

- E2E tests cover all modes with minimal, non-invasive code additions
  - Vite: 4 modes (dev, test, preview, docker)
  - Webpack: 3 modes (dev, test, docker)
- Cypress tests used for dev, preview (vite), docker modes
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
- No modifications to existing source code, configs, or application logic

## Out of Scope

- Preview mode for webpack (not implemented in the example)
- Testing without PWA (PWA is core to comprehensive examples)
- Modifying existing scripts or workflows (only adding tests)
- Changes to runtime-env CLI or library code
- Multi-stage Docker optimization (use existing Dockerfile pattern)

## Dependencies

- Cypress 15.7.1 (consistent with other examples)
- Existing build/pack tooling in CI
- No additional npm packages needed (cy.exec() handles all process management)

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
