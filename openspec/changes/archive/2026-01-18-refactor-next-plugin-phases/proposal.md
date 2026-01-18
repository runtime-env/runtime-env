# Change: Refactor next-plugin phases

## Why

To improve maintainability and clarity by strictly separating the logic for each Next.js phase into dedicated files. This ensures that phase-specific logic is encapsulated. Additionally, to simplify the plugin by leveraging `globalThis` directly and removing unnecessary complex replacements, while ensuring the example code remains intact and the CLI is not unnecessarily packed for Node.js environments.

## What Changes

- **MODIFIED** the internal code structure of `@runtime-env/next-plugin`.
- Split phase-specific logic into independent internal plugins:
  - `with-runtime-env-phase-development-server.ts`
  - `with-runtime-env-phase-production-build.ts`
  - `with-runtime-env-phase-production-server.ts`
- **SIMPLIFIED** `runtimeEnv` access:
  - Removed `DefinePlugin` and Turbopack `defines` that were injecting a `Proxy` for `runtimeEnv`.
  - Now relies on `globalThis.runtimeEnv` being populated at runtime.
  - **STRICT GLOBAL NAMESPACE**: Only `globalThis.runtimeEnv` is allowed to be set. Internal states (like errors) MUST NOT pollute the global namespace (e.g., removed `globalThis.__RUNTIME_ENV_ERROR__`).
- **FIXED** the environment variable baking issue by ensuring no inlining occurs during `PHASE_PRODUCTION_BUILD`.
- **CLEANUP**:
  - Removed `packages/next-plugin/src/server.ts`, `dev.ts`, and `build.ts`.
  - Centralized mandatory logic in `utils.ts`.
- **INTACT EXAMPLES & CI**: Ensure `examples/comprehensive-next` requires no changes to its source code or configuration. All existing CI test jobs MUST pass locally without modifications to the example or CI configuration.

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/*`
- **BREAKING**: If any user was relying on the `Proxy` behavior to access variables that were NOT in the schema but WERE in `process.env` via `runtimeEnv`, that will now fail as only schema-validated variables are populated into `globalThis.runtimeEnv`.
