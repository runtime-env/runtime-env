## MODIFIED Requirements

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

### Requirement: Type Safety (No 'any')

The implementation of the plugin SHALL NOT use the `any` type. Strict TypeScript types SHALL be defined for all configuration objects, environment variables, and internal states to ensure maximum type safety and developer productivity.

#### Scenario: No 'any' in codebase

- **GIVEN** the `@runtime-env/next-plugin` codebase
- **WHEN** performing a static analysis or type checking
- **THEN** NO instances of the `any` type SHALL be found in the `src/` directory (excluding intentional exclusions if any, though none are currently planned)
