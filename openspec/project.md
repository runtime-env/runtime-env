# Project Context

## Purpose

**runtime-env** provides a twelve-factor app solution for managing environment variables in JavaScript applications. The core value proposition is **"Build once, deploy anywhere"** - allowing environment variables to be changed at startup/runtime without rebuilding the application.

### Key Goals:

- Enable runtime configuration of environment variables in JavaScript apps
- Support type-safe environment variables with JSON Schema validation
- Provide TypeScript type definitions generated from schema
- Support template interpolation for HTML files
- Work with modern build tools (Vite, Webpack) and PWA/service workers

## Tech Stack

### Core Technologies

- **TypeScript** - Primary language for CLI package
- **Node.js** (LTS) - Runtime environment
- **esbuild** - Fast bundler for CLI compilation
- **npm workspaces** - Monorepo management

### CLI Dependencies

- **ajv** 8.17.1 - JSON Schema validation (with ajv-formats)
- **commander** 14.0.2 - CLI framework
- **json-schema-to-typescript** 15.0.4 - Generate TypeScript types from JSON Schema
- **serialize-javascript** 7.0.1 - Safe JavaScript object serialization
- **chokidar** 5.0.0 - File watching for development mode
- **lodash** 4.17.21 - Utilities

### Testing & Quality

- **Jest** 30.2.0 - Test runner (with ts-jest for TypeScript support)
- **Prettier** 3.7.4 - Code formatting

### Examples Tech Stack

- **Vite** 7.2.6 + vite-plugin-pwa - Modern build tool with PWA support
- **Webpack** 5.98.0 + workbox-webpack-plugin - Traditional bundler with PWA
- **Cypress** 15.7.1 - E2E testing framework
- **Docker** + **nginx** - Container deployment examples

## Project Conventions

### Code Style

- **Formatting**: Prettier 3.7.4 with default settings
- **Command**: `npm run format` applies formatting to all files
- **TypeScript**: ES modules with `esModuleInterop: true`
- **Imports**: Standard ES6 import syntax (`import X from "Y"`)
- **File Extensions**: `.ts` for TypeScript, `.js` for JavaScript

### Architecture Patterns

**Monorepo Structure**:

```
packages/cli/          # Main CLI package
  src/
    gen-js/           # Generate runtime-env.js
    gen-ts/           # Generate runtime-env.d.ts
    interpolate/      # HTML template interpolation
    create-generator/ # Core generator logic
  bin/                # Compiled CLI executable
examples/             # Usage examples
  comprehensive-vite/     # Full Vite example with PWA
  comprehensive-webpack/  # Full Webpack example with PWA
  development/           # Dev mode example
  production/            # Production deployment
  test/                  # Testing example
  workbox/              # PWA service worker example
```

**CLI Command Pattern**:

- Each command has `command.ts` (defines CLI options) and `act.ts` (implements logic)
- Commands: `gen-js`, `gen-ts`, `interpolate`
- Single executable bundled with esbuild for distribution

**JSON Schema Driven**:

- Environment variables defined in `.runtimeenvschema.json`
- Schema validates env vars at generation time
- Types generated from schema for TypeScript projects

### Testing Strategy

**Unit Tests**:

- Jest for CLI package (`packages/cli/tests/`)
- Test coverage for gen-js, gen-ts, interpolate commands
- Node flag: `--experimental-vm-modules` for ESM support

**E2E Tests**:

- Cypress 15.7.1 for browser-based examples
- Test modes: development, test, preview (Vite), docker
- Process management via `cy.exec()` (spawn servers, run docker)
- No `start-server-and-test` - use cy.exec() for full control

**CI Testing**:

- Build → Pack → Test workflow
- Tests run in same job after packing (no artifact downloads)
- `git clean -xdf` inside example directories between test modes
- Tarball installation from `../../packages/cli/runtime-env-cli-test.tgz`

### Git Workflow

- **Main branch**: `main` (protected)
- **CI**: GitHub Actions on push to main and pull requests
- **Commits**: Conventional Commits format for CLI releases
- **Releases**: `standard-version` for @runtime-env/cli versioning
- **Format**: `chore(release): @runtime-env/cli@{{currentTag}}`

## Domain Context

### Twelve-Factor App Principles

The project implements config management from [The Twelve-Factor App](https://12factor.net/config):

> "Store config in environment variables... easy to change between deploys without changing any code"

### Key Concepts

**Runtime vs Build-time**:

- Traditional: Env vars baked into bundle at build time (requires rebuild to change)
- Runtime-env: Template syntax (`<%= runtimeEnv.FOO %>`) replaced at startup/runtime

**Generated Files**:

- `runtime-env.js`: JavaScript file with `globalThis.runtimeEnv = { ... }`
- `runtime-env.d.ts`: TypeScript declarations for type safety
- Must be imported before application entry point

**Template Syntax**:

- HTML: `<%= runtimeEnv.VARIABLE_NAME %>` or `<%= runtimeEnv.nested.property %>`
- Replaced by `interpolate` command after build

**PWA/Service Worker**:

- Service workers need special handling for runtime-env updates
- Workbox plugin integration for cache management
- Revision patching to force service worker updates

### Common Workflows

The project follows "build once, deploy anywhere" principle with distinct command patterns per stage:

**Development Mode**:

- Run `gen-ts` to generate TypeScript types for IDE support
- Run `gen-js` to generate runtime-env.js from .env file
- Run `interpolate` to replace template syntax in HTML files
- All three commands typically run together for full dev experience

**Test Mode**:

- Run `gen-ts` to generate TypeScript types for test type checking
- Run `gen-js` to generate runtime-env.js from .env (or test fixtures)
- Run `interpolate` only if tests verify HTML content (optional)
- Ensures tests run against actual runtime behavior

**Bundling/Build Stage** (critical for "build once"):

- Run `gen-ts` ONLY to provide types during build
- Do NOT run `gen-js` - deferred to deploy stage
- Do NOT run `interpolate` - deferred to deploy stage
- Preserves template syntax (e.g., `<%= runtimeEnv.FOO %>`) in build output
- Built artifacts remain environment-agnostic

**Deploy Stage** (runtime injection):

- Run `gen-js` to generate runtime-env.js from deployment environment
- Run `interpolate` to replace templates with actual values
- Example: Docker container startup script executes both commands
- Enables same build artifact to work in dev/staging/production

**Key Principle**: Bundling only generates types. Runtime values (gen-js) and template replacement (interpolate) happen at deploy time, enabling the same build to work across all environments.

## Important Constraints

- **Keep type safety**: Do not use `any` in TypeScript code. Do not suppress type errors.
- **No code modifications**: E2E tests must not modify existing source code, configs, or application logic
- **Build once principle**: Applications must work with environment changes without rebuilding
- **Template preservation**: Build process must NOT process template syntax (e.g., `<%= runtimeEnv.FOO %>`)
- **Node LTS compatibility**: Target Node.js LTS versions
- **Single executable**: CLI bundles to single file with esbuild
- **Example isolation**: Each example is self-contained with its own dependencies

## External Dependencies

**npm Registry**:

- Published as `@runtime-env/cli` on npm
- Keywords: twelve-factor, import-meta-env, json-schema

**JSON Schema Ecosystem**:

- Follows json-schema.org specifications
- Uses Ajv for validation

**Build Tools**:

- Examples demonstrate integration with Vite and Webpack
- Compatible with various module bundlers

**Container Registries**:

- Docker Hub for base images (nginx, node)
- Examples show container deployment patterns

**CI/CD**:

- GitHub Actions for automated testing and releases
- ubuntu-latest runners
