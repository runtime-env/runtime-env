# Design Document: Comprehensive Examples E2E Tests

## Overview

This document describes the unified approach for adding E2E tests to both `examples/comprehensive-vite` and `examples/comprehensive-webpack`. The tests verify development mode with HMR, test execution, preview mode (vite only), and Docker deployment with runtime injection.

## Shared Design Patterns

Both examples follow the same E2E testing patterns with tooling-specific adaptations:

### Test Structure

```
examples/comprehensive-{vite|webpack}/
├── cypress/
│   ├── e2e/
│   │   ├── dev.cy.js      # Development mode with HMR
│   │   ├── preview.cy.js  # Preview mode (vite only)
│   │   └── docker.cy.js   # Docker deployment
│   └── support/
│       ├── e2e.js         # Global setup
│       └── commands.js    # Custom commands
├── cypress.config.js      # Cypress configuration
└── package.json           # Add cypress devDependency
```

### Test Execution Model

**Cypress-wrapped modes (dev, preview, docker)**:

- Cypress tests use `cy.exec()` to spawn background processes (e.g., `npm run dev &`)
- Cypress tests use `cy.exec()` to run npm scripts (`npm run build`, `npm run preview`)
- Cypress tests use `cy.exec()` to run docker commands (`docker build`, `docker run`, `docker stop`, `docker rm`)
- Cypress tests terminate spawned processes using `cy.exec('kill <pid>')` or `cy.exec('pkill -f ...')`
- If any `cy.exec()` command fails (non-zero exit code), the Cypress test fails
- This makes it simpler to see what happens during test execution, entirely within cy.exec()

**Direct execution (test mode)**:

- Test mode runs `npm run test` directly in CI (no Cypress wrapper)
- Simpler than wrapping test runners in Cypress
- Test runner output is directly visible in CI logs

## Example-Specific Differences

| Aspect              | comprehensive-vite | comprehensive-webpack          |
| ------------------- | ------------------ | ------------------------------ |
| Dev Server          | Vite (port 5173)   | webpack-dev-server (port 8080) |
| Test Runner         | Vitest             | Jest                           |
| PWA Plugin          | vite-plugin-pwa    | workbox-webpack-plugin         |
| Service Worker File | `dist/sw.js`       | `dist/service-worker.js`       |
| Preview Mode        | ✅ Yes (port 4173) | ❌ No                          |
| Test Modes          | 4                  | 3                              |

## CI Integration Pattern

All CI steps follow this pattern:

```yaml
- name: Test examples/comprehensive-{vite|webpack} ({mode})
  run: |
    cd examples/comprehensive-{vite|webpack}
    git clean -xdf  # Clean example directory (except first step)
    npm ci
    npm i ../../packages/cli/runtime-env-cli-test.tgz
    # Mode-specific commands
```

### Key CI Patterns

1. **No Artifact Download**: Test steps run in the same job after pack, no `needs: [build]` required
2. **Isolation**: `git clean -xdf` runs inside example directory between test modes
3. **No .env during build/docker**: Ensures template syntax is preserved
4. **Inline commands**: All test commands written directly in CI workflow (no npm scripts)
5. **Docker cleanup**: Always remove containers after test

## Test Mode Details

### 1. Dev Mode

**Purpose**: Verify development workflow with HMR

**Pattern** (Cypress test):

- Use `cy.exec('npm run dev > dev.log 2>&1 & echo $!')` to spawn dev server and capture PID
- Wait for server to be ready (poll localhost:{5173|8080})
- Visit localhost:{5173|8080}
- Verify page displays runtime-env value from .env
- Use `cy.writeFile()` to update .env file
- Wait for HMR (with timeout)
- Verify page displays updated value
- Use `cy.exec('kill <pid>')` to terminate dev server
- If npm run dev fails, Cypress test fails

### 2. Test Mode

**Purpose**: Verify test runner executes successfully

**Pattern**:

- Create .env file
- Run `npm run test` directly (no Cypress)
- Verify exit code 0
- Verify `src/runtime-env.d.ts` and `public/runtime-env.js` exist

### 3. Preview Mode (vite only)

**Purpose**: Verify preview server with interpolated values

**Pattern** (Cypress test):

- Use `cy.exec('npm run build')` WITHOUT .env
- Use `cy.writeFile()` to create .env AFTER build
- Use `cy.exec('npm run preview > preview.log 2>&1 & echo $!')` to spawn preview server and capture PID
- Wait for server to be ready (poll localhost:4173)
- Visit localhost:4173
- Verify page displays interpolated values (not template)
- Verify service worker loads and caches correctly
- Use `cy.exec('kill <pid>')` to terminate preview server
- If npm run build or npm run preview fails, Cypress test fails

### 4. Docker Mode

**Purpose**: Verify Docker deployment with runtime injection

**Pattern** (Cypress test):

- Use `cy.exec('cp ...')` to copy tarball to example directory
- Use `cy.exec('docker build ...')` to build Docker image WITHOUT .env
- Use `cy.exec('docker run ...')` to run container with environment variables at runtime
- Visit localhost:3000
- Verify page displays injected runtime-env values
- Verify service worker is patched
- Use `cy.exec('docker stop ...')` and `cy.exec('docker run ...')` to restart with different env values
- Verify new values displayed
- Use `cy.exec('docker stop ...')` and `cy.exec('docker rm ...')` to clean up containers
- If any docker command fails, Cypress test fails

## Trade-offs

### Why Cypress with cy.exec() for dev/preview/docker

- **Unified test framework**: All test logic (setup, execution, assertions) in one place
- **Simpler to see what happens**: Test output shows both command execution and browser verification
- **Better failure diagnosis**: Can see exactly which step failed (build, server start, or browser test)
- **Browser automation**: Can verify page content, HMR behavior, and service worker functionality
- **Consistent with other examples**: Follows the same Cypress pattern
- **cy.exec() handles failures**: If any npm or docker command fails, the test fails immediately
- **No extra dependencies**: Entirely runs via cy.exec(), no need for start-server-and-test
- **Process control**: Spawn processes with `&` and terminate with `kill`, fully controlled

### Why NOT Cypress for test mode

- Test runners (Vitest/Jest) run fast enough without E2E wrapper
- No browser interaction needed
- Simpler to run directly: `npm run test`
- Test runner output is more readable when not wrapped in Cypress
- Reduces test complexity and execution time
- No need for cy.exec() overhead when just running unit tests

### Why unified proposal

- Both examples follow nearly identical patterns
- Reduces duplication in documentation and maintenance
- Makes differences explicit and easier to understand
- Simplifies CI configuration with consistent structure

## Implementation Strategy

1. **Infrastructure first**: Set up Cypress in both examples
2. **Parallel development**: Implement test modes simultaneously for both examples
3. **CI integration**: Add CI steps for both examples in same PR
4. **Validation**: Ensure both test suites pass before merging

This approach ensures consistency while accommodating tooling-specific differences.

## Non-Invasive Implementation

**Critical constraint**: The implementation SHALL NOT modify any existing source code, build configurations, or application logic in the comprehensive examples. All changes are purely additive:

- **Add only**: New test files, test configuration, package.json dependencies
- **No modifications**: Existing src/, scripts/, webpack.config.js, vite.config.ts, Dockerfile, nginx.conf remain untouched
- **No refactoring**: Existing application code stays exactly as-is

This ensures the E2E tests validate the examples in their current working state without introducing risk of breaking changes.
