# webpack-example Specification

## Purpose

TBD - created by archiving change add-webpack-example-2025-12-07. Update Purpose after archive.

## Requirements

### Requirement: Comprehensive webpack example SHALL demonstrate all runtime-env workflows

`examples/comprehensive-webpack` SHALL provide a complete, runnable example that demonstrates all primary `@runtime-env/cli` workflows using webpack as the build tool, achieving feature parity with `examples/comprehensive-vite`.

#### Scenario: Generate runtime artifacts in development

- Given: A developer has cloned the repository and navigated to `examples/comprehensive-webpack`.
- When: They run `npm install` and `npm run dev`.
- Then: The development process generates `public/runtime-env.js`, `src/runtime-env.d.ts`, and interpolates `index.html` to `node_modules/.cache/runtime-env/index.html` using `<%= runtimeEnv.* %>` tokens.
- And: webpack-dev-server starts and serves the application with all generated artifacts available.

#### Scenario: Live reload on environment changes in development

- Given: The webpack example is running in development mode.
- When: A developer modifies `.runtimeenvschema.json` or the `.env` file.
- Then: The watch processes regenerate `public/runtime-env.js`, `src/runtime-env.d.ts`, and re-interpolate `index.html` to the cache.
- And: webpack-dev-server reloads the browser showing updated runtime values and HTML.

#### Scenario: TypeScript type safety with generated declarations

- Given: `.runtimeenvschema.json` defines environment keys including `FOO`.
- When: The developer runs `npm run dev` or `npm run build`.
- Then: A declaration file `src/runtime-env.d.ts` is created augmenting `globalThis` with the `runtimeEnv` shape.
- And: TypeScript source files like `src/index.ts` and test files can use `globalThis.runtimeEnv.FOO` with full type checking.

#### Scenario: Production build with type-only generation

- Given: The webpack example has been developed and tested.
- When: The developer runs `npm run build`.
- Then: The build runs `runtime-env gen-ts` for type checking only.
- And: webpack compiles TypeScript, bundles assets, and generates optimized output in `dist/`.
- And: HTML placeholders remain uninterpolated in the build output for runtime generation.

#### Scenario: Unit tests with runtime environment loaded

- Given: `tests/runtime-env.test.ts` contains tests for runtime behavior and TypeScript types.
- When: The developer runs `npm test`.
- Then: The test command runs `runtime-env gen-ts` and `runtime-env gen-js`.
- And: Jest executes tests with `public/runtime-env.js` loaded via `setupFilesAfterEnv` configuration.
- And: Tests verify both runtime values and TypeScript type safety using Jest matchers and type assertions.

#### Scenario: Preview mode with complete runtime generation

- Given: The webpack example has been built with `npm run build`.
- When: The developer runs `npm run preview`.
- Then: The preview process generates `dist/runtime-env.js` from `.env`.
- And: Creates a backup of `dist/index.html` and interpolates it with environment values.
- And: Creates a backup of `dist/service-worker.js` and patches runtime-env.js and index.html revisions.
- And: Starts a preview server serving the fully processed distribution.

#### Scenario: Docker deployment with SEA binaries

- Given: The webpack example includes a Dockerfile and start.sh script.
- When: The developer runs `docker build` on the example.
- Then: The Dockerfile creates Node SEA binaries for runtime-env CLI and patch-runtime-env-revision.
- And: The production image contains only the built assets, SEA binaries, and nginx.
- When: The container starts with environment variables set.
- Then: start.sh generates `runtime-env.js`, interpolates `index.html`, patches service worker revisions, and starts nginx.

#### Scenario: PWA support with service worker caching

- Given: The webpack example uses workbox-webpack-plugin to generate a service worker.
- When: The build runs with webpack configured.
- Then: webpack generates `service-worker.js` with Workbox caching strategies.
- And: The service worker includes `runtime-env.js` in `additionalManifestEntries` with revision `"placeholder"`.
- When: The container starts or preview runs.
- Then: `patch-runtime-env-revision.cjs` calculates MD5 hashes of `runtime-env.js` and interpolated `index.html`.
- And: Replaces the placeholder revision in service-worker.js with actual hashes.
- And: The service worker correctly caches all assets with proper cache invalidation.

#### Scenario: webpack-specific configuration and patterns

- Given: The webpack example includes `webpack.config.js`.
- When: Developers inspect the configuration.
- Then: The config demonstrates proper integration of html-webpack-plugin for HTML processing.
- And: Shows workbox-webpack-plugin configuration for PWA support.
- And: Uses ts-loader for TypeScript compilation with proper webpack rules.
- And: Configures webpack-dev-server to serve interpolated HTML from cache in development.
- And: Differentiates between development and production modes appropriately.

#### Scenario: Generated files are gitignored

- Given: The webpack example has a `.gitignore` file.
- When: Runtime artifacts are generated during development or testing.
- Then: `public/runtime-env.js`, `src/runtime-env.d.ts`, `node_modules/.cache/runtime-env/`, `.env`, and `*.bak` files are not tracked by git.
- And: These files are regenerated as needed by npm scripts or container startup.

#### Scenario: Documentation covers webpack-specific approaches

- Given: The webpack example includes a comprehensive README.md.
- When: Developers read the documentation.
- Then: The README explains all workflows (dev, test, build, preview, docker).
- And: Documents webpack-specific configuration patterns and plugins.
- And: Highlights key differences from the Vite approach.
- And: Provides troubleshooting guidance for common webpack issues.
- And: Includes project structure overview and script reference.

### Requirement: Preview feature for comprehensive-webpack example

The examples repository SHALL provide a `preview` command or equivalent for the `comprehensive-webpack` example that starts a local preview server showing the built output, matching the UX provided by the `comprehensive-vite` example.

#### Scenario: Start preview server

- **WHEN** a contributor runs the preview command from the `comprehensive-webpack` example directory
- **THEN** a local server SHALL start and serve the built output for manual inspection
- **AND** instructions to stop the server SHALL be documented in the example README

### Requirement: E2E tests for comprehensive-webpack preview

The examples repository SHALL provide Cypress E2E tests for the `comprehensive-webpack` example that validate the preview server serves the production build with interpolated runtime environment values, following the same "build once, deploy anywhere" verification used by `comprehensive-vite`.

#### Scenario: Preview E2E test (initial run)

- **WHEN** the example repository runs `npm run build` in the `comprehensive-webpack` directory
- **AND** CI or the tester creates an `.env` file with `FOO=preview-initial`
- **AND** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js --env EXPECTED_FOO=preview-initial'` is executed
- **THEN** the Cypress test SHALL visit `/` and assert the page displays the interpolated value `preview-initial` in `#app` and the page title

#### Scenario: Preview E2E test (updated env run)

- **WHEN** the `.env` file is updated to `FOO=preview-updated`
- **AND** `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js --env EXPECTED_FOO=preview-updated'` is executed
- **THEN** the Cypress test SHALL visit `/` and assert the page displays the interpolated value `preview-updated`, demonstrating the same build can serve different runtime env values without rebuilding

### Requirement: CI workflow preview step for comprehensive-webpack

The CI pipeline SHALL include a job/step named "Test examples/comprehensive-webpack (preview)" that runs the preview E2E workflow using `start-server-and-test` and executes the preview Cypress test twice with different `.env` values to verify the "build once, deploy anywhere" behavior.

#### Scenario: CI preview step

- **WHEN** CI runs the preview step for `examples/comprehensive-webpack`
- **THEN** CI SHALL run `npm run build`, create an `.env` with `FOO=preview-initial`, run the preview E2E test (initial), update `.env` to `FOO=preview-updated`, and run the preview E2E test again (updated)
- **AND** the step SHALL use `start-server-and-test preview http://localhost:4173 'cypress run --spec cypress/e2e/preview.cy.js'` to manage the server lifecycle
