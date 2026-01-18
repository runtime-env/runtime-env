## MODIFIED Requirements

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
