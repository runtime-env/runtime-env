# Add E2E Tests for Comprehensive Examples

## Problem Statement

The comprehensive examples (`comprehensive-vite` and `comprehensive-webpack`) currently have unit tests but lack end-to-end tests to verify the complete workflows:

**Both examples need:**

- **Development mode**: Server starts, HTML is interpolated, runtime-env.js is generated, HMR works when .env changes
- **Build mode**: Production bundle is created with correct template syntax preserved
- **Test mode**: Test runner (Vitest/Jest) runs successfully with runtime-env types and values
- **Docker deployment**: Container deployment with runtime environment injection

**Vite-specific:**

- **Preview mode**: Production build can be served with interpolated values

Unlike simpler examples (development, production, workbox), these comprehensive examples have not been tested in CI, leaving gaps in verification that all modes work correctly together.

## Proposed Solution

Add E2E tests to both `examples/comprehensive-vite` and `examples/comprehensive-webpack` that verify (minimal code additions only):

### Shared Test Patterns

1. **Dev mode test**:
   - Start dev server with `npm run dev`
   - Verify page displays runtime-env value
   - Update .env file during test
   - Verify HMR updates the displayed value
   - Ports: vite=5173, webpack=8080

2. **Build mode test**:
   - Run `npm run build` WITHOUT .env file (no environment variables during build)
   - Verify key dist files ensure:
     - `dist/index.html` contains `<%= runtimeEnv.FOO %>` (unchanged template syntax)
     - Service worker exists with runtime-env entry (sw.js for vite, service-worker.js for webpack)

3. **Test mode verification**:
   - Run `npm run test` directly in CI (no Cypress wrapper)
   - Verify test runner (Vitest/Jest) passes

4. **Docker deployment test**:
   - Build Docker image with `docker build` (NO .env during build)
   - Run container with environment variables at runtime
   - Verify runtime-env injection at container startup
   - Verify service worker patching in container
   - Clean up container after test

### Vite-Specific Test

4. **Preview mode test** (vite only):
   - Run `npm run build` WITHOUT .env file
   - Create .env AFTER build
   - Run preview preparation scripts (interpolation, service worker patching)
   - Start preview server
   - Verify page displays interpolated runtime-env value
   - Verify service worker is patched correctly

### CI Integration

Add CI jobs that follow the same pattern as other examples:

- Download artifacts from build job
- Install tarball (not link workspace)
- Run `git clean -xdf` at repository root between test modes
- Run E2E test suite
- Vite: 5 modes (dev, build, test, preview, docker)
- Webpack: 4 modes (dev, build, test, docker)

## Success Criteria

- E2E tests cover all modes with minimal code
  - Vite: 4 modes (dev, test, preview, docker)
  - Webpack: 3 modes (dev, test, docker)
- Cypress tests used for dev, preview (vite), docker modes
- Test mode runs `npm run test` directly (no Cypress wrapper)
- Tests verify HMR functionality in dev mode
- Builds run WITHOUT .env file during preview/docker modes
- Docker tests verify production deployment with runtime injection
- CI runs comprehensive example tests alongside other examples using artifact download
- Tests use tarball installation (not workspace linking)
- `git clean -xdf` runs at repository root between test modes
- All tests pass in CI
- Docker containers are properly cleaned up after tests

## Out of Scope

- Preview mode for webpack (not implemented in the example)
- Testing without PWA (PWA is core to comprehensive examples)
- Modifying existing scripts or workflows (only adding tests)
- Changes to runtime-env CLI or library code
- Multi-stage Docker optimization (use existing Dockerfile pattern)

## Dependencies

- Cypress 15.7.1 (consistent with other examples)
- start-server-and-test 2.1.3 (for running servers during tests)
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
