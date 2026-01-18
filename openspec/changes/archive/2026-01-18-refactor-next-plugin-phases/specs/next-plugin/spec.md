## MODIFIED Requirements

### Requirement: Next.js Plugin Implementation

The `@runtime-env/next-plugin` SHALL be implemented with a modular structure to ensure a seamless and idiomatic developer experience, providing robust TypeScript types and leveraging `globalThis` for environment variable access.

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
- **THEN** the plugin SHALL populate `globalThis.runtimeEnv` with filtered environment variables.
- **AND** the plugin SHALL NOT set any other properties on `globalThis`.
- **AND** the source code SHALL access these variables via `runtimeEnv` (or `globalThis.runtimeEnv`) without requiring build-time text replacement (e.g., `DefinePlugin`).
- **AND** the plugin SHALL NOT inline `NEXT_PUBLIC_` environment variables into the bundled source code during `PHASE_PRODUCTION_BUILD`.
- **AND** the client-side access via `globalThis.runtimeEnv` SHALL reflect the values present at runtime, injected via the `RuntimeEnvScript` component.
