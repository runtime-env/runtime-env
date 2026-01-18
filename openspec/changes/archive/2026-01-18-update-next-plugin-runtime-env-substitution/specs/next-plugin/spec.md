## MODIFIED Requirements

### Requirement: Universal Global Variable

The plugin SHALL ensure `runtimeEnv` is available across all environments by automatically replacing it with a robust access pattern (`(typeof window !== 'undefined' ? globalThis : process.env).runtimeEnv`). This replacement SHALL be performed using Webpack's `DefinePlugin` when Webpack is used, and via Turbopack's `defines` configuration when Turbopack is used (where supported).

#### Scenario: Server-side consistency

- **WHEN** accessing `runtimeEnv` on the server
- **THEN** it SHALL resolve to `process.env.runtimeEnv`
- **AND** it SHALL have been populated by the plugin as an object during initialization (dev or production server).

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

### Requirement: Next.js Plugin Implementation

The `@runtime-env/next-plugin` SHALL be implemented with a modular structure to ensure a seamless and idiomatic developer experience, providing robust TypeScript types and leveraging `process.env.runtimeEnv` and `globalThis.runtimeEnv` for environment variable access.

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
- **AND** the client-side access via `globalThis.runtimeEnv` SHALL reflect the values present at runtime, injected via the `RuntimeEnvScript` component.
