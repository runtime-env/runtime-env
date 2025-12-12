# Proposal: Remove PWA Implementation from Comprehensive Examples

## Change ID

`remove-comprehensive-pwa-2025-12-09`

## Problem Statement

The comprehensive examples (comprehensive-vite and comprehensive-webpack) currently include Progressive Web App (PWA) functionality with service workers, cache busting, and related complexity. This adds significant overhead:

1. **vite-plugin-pwa** and **workbox-webpack-plugin** dependencies
2. Service worker registration and lifecycle management code
3. Custom cache-busting scripts (`patch-runtime-env-revision.cjs`)
4. Additional E2E test files specifically for service worker updates (`*-sw.cy.js`)
5. Preview/Docker npm scripts complexity for patching service workers
6. Documentation overhead explaining PWA-specific behaviors

While PWA support is valuable, it's not core to demonstrating the runtime-env CLI's primary value proposition: **"build once, deploy anywhere"** with runtime environment variable injection. The PWA functionality distracts from the core learning objectives and adds maintenance burden.

## Why

Removing the PWA/service-worker functionality reduces maintenance and CI complexity while keeping the examples focused on demonstrating runtime-env's core capabilities. The PWA features are orthogonal to the CLI's main learning goals and are already covered by the `examples/workbox` sample for users who need a PWA demonstration.

## Proposed Solution

Remove all PWA/service worker functionality from both comprehensive examples while preserving their core purpose: demonstrating runtime environment variable injection across different deployment modes (dev, test, preview, docker).

### What Will Be Removed

**From comprehensive-vite:**

- `vite-plugin-pwa` dependency and configuration
- Service worker registration in `src/main.ts`
- `scripts/patch-runtime-env-revision.cjs`
- `preview:runtime-env:pwa` npm script
- SW update E2E tests: `cypress/e2e/preview-sw.cy.js`, `cypress/e2e/docker-sw.cy.js`
- CI steps for SW update testing

**From comprehensive-webpack:**

- `workbox-webpack-plugin` dependency and configuration
- Service worker registration in `src/index.ts`
- `scripts/patch-runtime-env-revision.cjs`
- SW update E2E tests: `cypress/e2e/docker-sw.cy.js`
- CI steps for SW update testing
- PWA-related documentation sections

**From both:**

- All references to service workers in README files
- Service worker verification assertions in remaining E2E tests
- CI workflow steps that test service worker updates

### What Will Be Preserved

- Runtime environment variable injection and interpolation
- Dev mode with HMR/auto-reload
- Test mode execution
- Preview mode (vite) with static file serving
- Docker deployment with runtime injection
- E2E tests for: `dev.cy.js`, `preview.cy.js` (vite), `docker.cy.js`
- All core runtime-env CLI functionality demonstrations

## What Changes

This change removes PWA/service worker related code, dependencies, scripts, tests, and documentation from the comprehensive examples while preserving runtime-env demonstrations. See the "What Will Be Removed" and "What Will Be Preserved" sections for a detailed list of deltas.

## Impact Assessment

### Benefits

1. **Simplified examples**: Focus solely on runtime-env core functionality
2. **Reduced dependencies**: Remove 2 major PWA-related packages
3. **Less maintenance**: Fewer tests, scripts, and documentation to maintain
4. **Clearer learning path**: Users focus on runtime-env without PWA distractions
5. **Faster CI**: Fewer test scenarios to run

### Risks

1. **Loss of PWA demonstration**: Separate `workbox` example still demonstrates service worker integration
2. **Breaking changes**: None - these are example projects, not published packages

### Mitigation

- The existing `examples/workbox` already demonstrates PWA integration with runtime-env
- Documentation can reference the workbox example for users needing PWA support
- Core runtime-env CLI capabilities remain fully demonstrated

## Success Criteria

1. Both comprehensive examples build, test, and deploy successfully without PWA dependencies
2. All remaining E2E tests pass (dev, test, preview, docker modes)
3. CI workflow runs successfully with reduced test matrix
4. README files clearly document what's demonstrated (no PWA mentions)
5. Examples remain comprehensive demonstrations of runtime-env core features
6. No breaking changes to runtime-env CLI itself

## Dependencies

- Requires updating `add-comprehensive-examples-e2e-2025-12-08` spec to remove SW-related requirements
- No dependencies on other packages or external systems

## Timeline Estimate

- Implementation: 2-3 hours
- Testing: 1 hour
- Documentation updates: 1 hour
- Total: 4-5 hours
