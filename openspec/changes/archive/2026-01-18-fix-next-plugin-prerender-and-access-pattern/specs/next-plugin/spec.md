## MODIFIED Requirements

### Requirement: Universal Global Variable

The plugin SHALL ensure `runtimeEnv` is available across all environments by automatically replacing it with a robust access pattern (`(typeof window !== 'undefined' ? window : process.env).runtimeEnv`). This replacement SHALL be performed using Webpack's `DefinePlugin` when Webpack is used, and via Turbopack's `defines` configuration when Turbopack is used (where supported).

#### Scenario: Server-side consistency

- **WHEN** accessing `runtimeEnv` on the server
- **THEN** it SHALL resolve to `process.env.runtimeEnv`
- **AND** it SHALL have been populated by the plugin during initialization (dev or production server).

#### Scenario: Client-side consistency

- **WHEN** accessing `runtimeEnv` on the client
- **THEN** it SHALL resolve to `window.runtimeEnv` (populated by the manually added `<RuntimeEnvScript />`).

#### Scenario: Automatic Replacement (Webpack)

- **GIVEN** user code contains `runtimeEnv.NEXT_PUBLIC_FOO`
- **AND** Next.js is using Webpack
- **WHEN** Next.js compiles the code
- **THEN** `runtimeEnv` SHALL be replaced with `(typeof window !== 'undefined' ? window : process.env).runtimeEnv` via `DefinePlugin`.

#### Scenario: Automatic Replacement (Turbopack)

- **GIVEN** user code contains `runtimeEnv.NEXT_PUBLIC_FOO`
- **AND** Next.js is using Turbopack
- **WHEN** Next.js compiles the code
- **THEN** `runtimeEnv` SHALL be replaced with `(typeof window !== 'undefined' ? window : process.env).runtimeEnv` via `string-replace-loader` (configured in `turbopack.rules` or `experimental.turbo.rules`).
- **AND** if Turbopack does not support custom loaders or the replacement fails, the plugin SHALL ensure `globalThis.runtimeEnv` is populated during the build as a fallback.

### Requirement: Build-Time Environment Independence

The plugin SHALL NOT require `.env` files to be present during `next build` and SHALL NOT bake any environment variable values into the compiled bundle. To support prerendering, it SHALL populate `runtimeEnv` with placeholder strings.

#### Scenario: Build without .env files

- **GIVEN** a Next.js project with the plugin configured
- **AND** NO `.env` files are present in the project root
- **WHEN** running `next build`
- **THEN** the build SHALL succeed
- **AND** the resulting bundle SHALL NOT contain any hardcoded values from environment variables
- **AND** the application SHALL correctly resolve environment variables at runtime when they are provided.

#### Scenario: Build with placeholders for prerendering

- **GIVEN** a Next.js project with the plugin configured
- **WHEN** running `next build`
- **THEN** the plugin SHALL populate `process.env.runtimeEnv` with placeholder values (e.g., `"${NEXT_PUBLIC_VAR}"`)
- **AND** the build SHALL succeed.
- **AND** any prerendered pages using these variables SHALL contain the placeholders instead of real values, ensuring environment independence of the build artifacts.

### Requirement: Zero-Config Environment Management

The plugin SHALL automatically manage environment variables and ensure they are available in-memory without requiring the user to manually manage script files in their `public/` directory.

#### Scenario: Development mode watcher and graceful teardown

- **WHEN** the Next.js dev server starts
- **THEN** the plugin SHALL start a file watcher for environment and schema files
- **AND** it SHALL NOT write any files to the user's `public/` directory
- **AND** it SHALL trigger `runtime-env gen-ts` on changes
- **AND** it SHALL explicitly close the watcher when the Next.js process exits to prevent resource leaks

#### Scenario: Standalone Output compatibility

- **GIVEN** `output: 'standalone'` is configured in `next.config.js`
- **WHEN** running `next build`
- **THEN** the plugin SHALL ensure `runtimeEnv` continues to resolve to `process.env.runtimeEnv` on the server in the production build.
- **AND** the `<RuntimeEnvScript />` SHALL continue to function correctly by reading environment variables from the production environment at request time.

### Requirement: Next.js Plugin Implementation

The `@runtime-env/next-plugin` SHALL be implemented with a modular structure to ensure a seamless and idiomatic developer experience, providing robust TypeScript types and leveraging `process.env.runtimeEnv` and `window.runtimeEnv` for environment variable access.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/next-plugin/src` directory.
- **WHEN** they view the file structure.
- **THEN** they find a modular structure with independent plugins for each phase:
  - `with-runtime-env-phase-development-server.ts`
  - `with-runtime-env-phase-production-build.ts`
  - `with-runtime-env-phase-production-server.ts`
- **AND** the `withRuntimeEnv` wrapper in `with-runtime-env.ts` SHALL compose these three plugins.
- **AND** `index.ts` SHALL serve as the clean public entry point.
- **AND** shared logic for CLI invocation, environment injection, and file system utilities SHALL be centralized in `utils.ts`.

#### Scenario: Runtime Environment Variable Population

- **GIVEN** a Next.js application using `@runtime-env/next-plugin`.
- **WHEN** the application is running (dev or production server).
- **THEN** the plugin SHALL populate `process.env.runtimeEnv` with filtered environment variables.
- **AND** the plugin SHALL NOT set any other properties on `globalThis` or `process.env` except for `runtimeEnv`.
- **AND** the source code SHALL access these variables via `runtimeEnv`.
- **AND** the plugin SHALL NOT inline `NEXT_PUBLIC_` environment variables into the bundled source code during `PHASE_PRODUCTION_BUILD`.
- **AND** the client-side access via `window.runtimeEnv` SHALL reflect the values present at runtime, injected via the `RuntimeEnvScript` component.
