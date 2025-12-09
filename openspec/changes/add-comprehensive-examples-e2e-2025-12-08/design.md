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

**Server-managed modes (dev, preview, docker)**:

- Use `start-server-and-test` npm package to manage server lifecycle OUTSIDE Cypress
- `start-server-and-test` spawns the server (npm run dev/preview or docker run)
- `start-server-and-test` polls the server URL until ready
- `start-server-and-test` runs Cypress tests with server already available
- `start-server-and-test` automatically terminates server after tests complete
- Cypress tests use `cy.exec()` ONLY for file operations (updating .env files)
- If server fails to start, command fails before Cypress runs
- This follows Cypress best practices (server management outside of Cypress)

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

**Pattern** (using `start-server-and-test` OUTSIDE Cypress):

- CI creates `.env` file with `echo "FOO=dev-initial" > .env`
- CI runs `start-server-and-test dev http://localhost:{5173|8080} 'cypress run --spec cypress/e2e/dev.cy.js'`
- `start-server-and-test` spawns dev server (`npm run dev`)
- `start-server-and-test` polls localhost:{5173|8080} until ready
- `start-server-and-test` runs Cypress test with server already available
- Cypress test visits localhost:{5173|8080}
- Cypress test verifies page displays runtime-env value from .env
- Cypress test uses `cy.exec('echo "FOO=dev-updated" > .env')` to update .env file
- Cypress test waits 2000ms for HMR/file change detection
- Cypress test verifies page displays updated value (Vite: auto HMR, Webpack: auto-reload)
- `start-server-and-test` terminates dev server automatically after Cypress completes
- If dev server fails to start, command fails before Cypress runs

### 2. Test Mode

**Purpose**: Verify test runner executes successfully

**Pattern**:

- Create .env file
- Run `npm run test` directly (no Cypress)
- Verify exit code 0
- Verify `src/runtime-env.d.ts` and `public/runtime-env.js` exist

### 3. Preview Mode (vite only)

**Purpose**: Verify preview server with interpolated values

**Pattern** (using `start-server-and-test` OUTSIDE Cypress):

- CI runs `npm run build` WITHOUT .env (preserves template syntax)
- CI creates `.env` file AFTER build with `echo "FOO=preview-value" > .env`
- CI runs `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'`
- `start-server-and-test` spawns preview server (`npm run preview`)
- `start-server-and-test` polls localhost:4173 until ready
- `start-server-and-test` runs Cypress test with server already available
- Cypress test visits localhost:4173
- Cypress test verifies page displays interpolated values (not template syntax)
- Cypress test verifies service worker installs successfully
- `start-server-and-test` terminates preview server automatically after Cypress completes
- CI updates `.env` with `echo "FOO=preview-updated" > .env`
- CI runs `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview-sw.cy.js'`
- Cypress SW test reloads page twice to verify service worker update with new env values
- Both tests run in same CI step without rebuilding (demonstrates "build once, deploy anywhere")

### 4. Docker Mode

**Purpose**: Verify Docker deployment with runtime injection

**Pattern** (using `start-server-and-test` OUTSIDE Cypress):

- CI copies tarball to example directory with `cp ../../packages/cli/runtime-env-cli-test.tgz .`
- CI builds Docker image with `docker build -t comprehensive-{vite|webpack} .` (WITHOUT .env)
- CI runs `start-server-and-test 'docker run -p 3000:80 -e FOO=docker-value comprehensive-{vite|webpack}' 3000 'cypress run --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-{vite|webpack} -q | xargs docker rm -f`
- `start-server-and-test` runs container in foreground with runtime env injection via `-e FOO=docker-value`
- `start-server-and-test` polls port 3000 until ready
- `start-server-and-test` runs Cypress test with container already available
- Cypress test visits localhost:3000
- Cypress test verifies page displays injected runtime-env values
- Cypress test verifies service worker is patched correctly
- `start-server-and-test` terminates container automatically (sends SIGTERM)
- Cleanup command runs: `docker ps -f ancestor=IMAGE -q | xargs docker rm -f`
- CI runs `start-server-and-test 'docker run -p 3000:80 -e FOO=docker-updated comprehensive-{vite|webpack}' 3000 'cypress run --spec cypress/e2e/docker-sw.cy.js' && docker ps -f ancestor=comprehensive-{vite|webpack} -q | xargs docker rm -f`
- Cypress SW test reloads page twice to verify service worker update with new env values
- Both tests run in same CI step using same image but different runtime env values (demonstrates runtime config flexibility)

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
