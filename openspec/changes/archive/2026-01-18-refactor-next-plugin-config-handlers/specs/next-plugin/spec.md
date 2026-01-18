## MODIFIED Requirements

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
