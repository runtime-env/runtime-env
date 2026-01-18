# next-plugin Specification

## Purpose

TBD - created by archiving change add-next-plugin. Update Purpose after archive.

## Requirements

### Requirement: withRuntimeEnv Wrapper

The plugin SHALL provide a `withRuntimeEnv` function that wraps a Next.js configuration object.

#### Scenario: Basic usage

- **GIVEN** a Next.js project with `.runtimeenvschema.json`
- **WHEN** the user wraps their `next.config.js` with `withRuntimeEnv`
- **THEN** the application SHALL have access to `runtimeEnv` global variable

### Requirement: Universal Global Variable

The plugin SHALL ensure `runtimeEnv` is available across all environments by automatically replacing it with a robust access pattern (`(typeof window !== 'undefined' ? globalThis : process.env).runtimeEnv`). This replacement SHALL be performed using Webpack's `DefinePlugin` when Webpack is used, and via Turbopack's `defines` configuration when Turbopack is used (where supported).

#### Scenario: Server-side consistency

- **WHEN** accessing `runtimeEnv` on the server
- **THEN** it SHALL resolve to `process.env.runtimeEnv`.
- **AND** it SHALL have been populated by the plugin during initialization (dev or production server).
- **AND** in development mode, it SHALL dynamically reflect changes to environment variables without requiring a full process restart where possible (e.g., via getters).

#### Scenario: Client-side consistency

- **WHEN** accessing `runtimeEnv` on the client
- **THEN** it SHALL resolve to `globalThis.runtimeEnv` (populated by the manually added `<RuntimeEnvScript />`).

#### Scenario: Automatic Replacement (Webpack)

- **GIVEN** user code contains `runtimeEnv.NEXT_PUBLIC_FOO`
- **AND** Next.js is using Webpack
- **WHEN** Next.js compiles the code
- **THEN** `runtimeEnv` SHALL be replaced with `(typeof window !== 'undefined' ? globalThis : process.env).runtimeEnv` via `DefinePlugin`.

#### Scenario: Automatic Replacement (Turbopack)

- **GIVEN** user code contains `runtimeEnv.NEXT_PUBLIC_FOO`
- **AND** Next.js is using Turbopack
- **WHEN** Next.js compiles the code
- **THEN** `runtimeEnv` SHALL be replaced with `(typeof window !== 'undefined' ? globalThis : process.env).runtimeEnv` via `string-replace-loader` (configured in `turbopack.rules` or `experimental.turbo.rules`).

### Requirement: Manual Script Injection

The plugin SHALL provide a `<RuntimeEnvScript />` component that users MUST manually add to their root layout (App Router) or document (Pages Router) to enable client-side environment variable access.

#### Scenario: next/script usage

- **GIVEN** a Next.js project with `withRuntimeEnv` configured
- **AND** the user has added `<RuntimeEnvScript />` to their application
- **WHEN** the component is rendered
- **THEN** it SHALL use the `Script` component from `next/script` to inject environment variables
- **AND** it SHALL ensure variables are populated on the client before other scripts execute
- **AND** it SHALL NOT cause nesting errors (e.g., "<html> cannot contain a nested <script>") by allowing Next.js to manage the script's placement via the `Script` component.

### Requirement: Automatic Type Generation

The plugin SHALL generate TypeScript definitions for `runtimeEnv` automatically.

#### Scenario: Type generation on startup

- **WHEN** the Next.js server starts (dev or build)
- **THEN** it SHALL run `runtime-env gen-ts` to update `runtime-env.d.ts`

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

### Requirement: Cross-Version Compatibility (Next.js 13-16)

The plugin SHALL support Next.js versions 13, 14, 15, and 16 by automatically detecting the running version and adapting to its lifecycle and component patterns.

#### Scenario: On-the-fly version detection

- **GIVEN** a supported version of Next.js
- **WHEN** the plugin initializes
- **THEN** it SHALL detect the Next.js version dynamically at runtime using the `next` CLI
- **AND** it SHALL adapt its internal configuration (e.g., merging strategies) based on the detected version

### Requirement: Public Prefix Enforcement

The plugin SHALL strictly enforce that all environment variables managed via `runtimeEnv` are prefixed with `NEXT_PUBLIC_` to align with Next.js's security model.

#### Scenario: Rejection of non-public keys in schema

- **GIVEN** a `.runtimeenvschema.json` containing a key `DATABASE_PASSWORD` (missing `NEXT_PUBLIC_` prefix)
- **WHEN** the Next.js server starts (including during `next build` or `next dev`)
- **THEN** the plugin SHALL throw a descriptive Error
- **AND** the build/server SHALL fail to start

#### Scenario: Successful initialization with public-only keys

- **GIVEN** a `.runtimeenvschema.json` where all keys start with `NEXT_PUBLIC_`
- **WHEN** the Next.js server starts
- **THEN** the plugin SHALL initialize successfully

#### Scenario: Secret variable leak prevention

- **GIVEN** a `.runtimeenvschema.json` that somehow contains a non-public key (e.g., if validation was bypassed)
- **WHEN** `<RuntimeEnvScript />` renders on the server
- **THEN** it SHALL NOT include any values for keys that do not start with `NEXT_PUBLIC_` in the generated client-side script
- **AND** it SHOULD log a warning in development mode if such keys are detected

### Requirement: Development Mode Synchronization

The plugin SHALL support automatic updates or reloads when environment variables change in development, ensuring that subsequent requests or component renders use the updated values.

#### Scenario: Update on .env change

- **GIVEN** `next dev` is running
- **WHEN** a `.env` file is modified
- **THEN** Next.js SHALL reload the server
- **AND** the plugin SHALL regenerate `runtime-env.d.ts` to ensure types are in sync
- **AND** the next page render SHALL include the updated values in the inline script

#### Scenario: Subsequent access in Client Components

- **GIVEN** `next dev` is running and a component has already rendered
- **WHEN** an environment variable is updated in `.env`
- **AND** the user navigates or reloads the page
- **THEN** the client-side `globalThis.runtimeEnv` SHALL reflect the updated values provided by the newly rendered inline script

#### Scenario: Hydration consistency after .env change

- **GIVEN** `next dev` is running
- **WHEN** a `.env` file is modified
- **AND** a page is rendered (SSR)
- **THEN** the server-side values used during SSR SHALL match the values injected into the client-side `globalThis.runtimeEnv`
- **AND** NO hydration mismatch SHALL occur.

### Requirement: Clean Project Root (Next.js)

The `@runtime-env/next-plugin` SHALL maintain a clean project root by using temporary directories or in-memory storage for all internal artifacts.

#### Scenario: No visible artifacts in project root

- **GIVEN** the plugin is active.
- **WHEN** it needs to generate temporary files.
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output file `runtime-env.d.ts` if a `tsconfig.json` is present.
- **AND** all other temporary artifacts SHALL be stored within `node_modules/.runtime-env` or kept in-memory.

### Requirement: Phase Detection using next/constants

The plugin SHALL use constants from `next/constants` for all phase-specific logic (e.g., `PHASE_DEVELOPMENT_SERVER`, `PHASE_PRODUCTION_BUILD`) instead of hardcoded literal strings.

#### Scenario: Using PHASE_DEVELOPMENT_SERVER

- **GIVEN** the plugin is initializing in development mode
- **WHEN** it checks the current phase
- **THEN** it SHALL use the `PHASE_DEVELOPMENT_SERVER` constant from `next/constants` for comparison

### Requirement: Type Safety (No 'any')

The implementation of the plugin SHALL NOT use the `any` type. Strict TypeScript types SHALL be defined for all configuration objects, environment variables, and internal states to ensure maximum type safety and developer productivity.

#### Scenario: No 'any' in codebase

- **GIVEN** the `@runtime-env/next-plugin` codebase
- **WHEN** performing a static analysis or type checking
- **THEN** NO instances of the `any` type SHALL be found in the `src/` directory (excluding intentional exclusions if any, though none are currently planned)

### Requirement: Next.js Plugin Implementation

The `@runtime-env/next-plugin` SHALL be implemented with a modular structure to ensure a seamless and idiomatic developer experience, providing robust TypeScript types and leveraging `process.env.runtimeEnv` and `globalThis.runtimeEnv` for environment variable access.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/next-plugin/src` directory.
- **WHEN** they view the file structure.
- **THEN** they find a modular structure with independent plugins for each phase:
  - `with-runtime-env-phase-development-server.ts`
  - `with-runtime-env-phase-production-build.ts`
  - `with-runtime-env-phase-production-server.ts`
- **AND** configuration handling for bundlers is separated into:
  - `with-runtime-env-webpack.ts`
  - `with-runtime-env-experimental-turbo.ts` (for `experimental.turbo`)
  - `with-runtime-env-turbopack.ts` (for root `turbopack`)
- **AND** the `withRuntimeEnv` wrapper in `with-runtime-env.ts` SHALL compose these modules.
- **AND** `index.ts` SHALL serve as the clean public entry point.
- **AND** shared logic for CLI invocation, environment injection, and file system utilities SHALL be centralized in `utils.ts`.

#### Scenario: Version Targeting

- **GIVEN** a Next.js application using `@runtime-env/next-plugin`.
- **WHEN** the plugin initializes configuration.
- **THEN** `with-runtime-env.ts` SHALL attempt to apply all configuration handlers.
- **AND** `with-runtime-env-experimental-turbo.ts` SHALL internally check if the Next.js version is < 15.3.0 and abort if not.
- **AND** `with-runtime-env-turbopack.ts` SHALL internally check if the Next.js version is >= 15.3.0 and abort if not.
- **AND** `with-runtime-env-webpack.ts` SHALL apply to all versions.

#### Scenario: Runtime Environment Variable Population

- **GIVEN** a Next.js application using `@runtime-env/next-plugin`.
- **WHEN** the application is running (dev or production server).
- **THEN** the plugin SHALL populate `process.env.runtimeEnv` with filtered environment variables.
- **AND** the plugin SHALL NOT set any other properties on `globalThis` or `process.env` except for `runtimeEnv`.
- **AND** the source code SHALL access these variables via `runtimeEnv`.
- **AND** the plugin SHALL NOT inline `NEXT_PUBLIC_` environment variables into the bundled source code during `PHASE_PRODUCTION_BUILD`.
- **AND** the client-side access via `globalThis.runtimeEnv` SHALL reflect the values present at runtime, injected via the `RuntimeEnvScript` component.

### Requirement: Informative and Resilient Integration (Next.js)

The plugin SHALL provide descriptive feedback for integration issues and remain resilient in development mode, while enforcing mandatory configurations during the build process and production startup.

#### Scenario: CLI execution failure in dev

- **GIVEN** the plugin is running in `next dev` mode.
- **WHEN** a `runtime-env` CLI command fails or the schema is invalid.
- **THEN** the plugin SHALL report a descriptive error message to the console.
- **AND** it SHALL leverage Next.js's native error overlay to display the error in the browser (e.g., by having `<RuntimeEnvScript />` throw the error during render).
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.

#### Scenario: Recovery to success state (Next.js)

- **GIVEN** the plugin was previously reporting an error in `next dev`.
- **WHEN** the underlying issue is resolved (e.g., user fixes schema).
- **THEN** the next page render SHALL succeed without showing the error overlay.
- **AND** the application SHALL correctly resolve environment variables.

#### Scenario: CLI execution failure in build

- **GIVEN** the plugin is running during `next build`.
- **WHEN** a `runtime-env` CLI command fails or configuration is invalid (e.g., prefix enforcement failure).
- **THEN** the plugin SHALL report the error politely.
- **AND** the build process SHALL fail.

#### Scenario: CLI execution failure in production start

- **GIVEN** the plugin is running in production mode (`next start` or `node server.js`).
- **WHEN** the environment variables are insufficient or incorrect according to the schema.
- **THEN** the plugin SHALL report a descriptive error message to the console.
- **AND** the process SHALL exit with code 1 immediately.
