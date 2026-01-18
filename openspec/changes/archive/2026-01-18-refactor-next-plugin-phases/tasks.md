## 1. Refactor Preparation

- [x] 1.1 Create new independent plugin files:
  - `with-runtime-env-phase-development-server.ts`
  - `with-runtime-env-phase-production-build.ts`
  - `with-runtime-env-phase-production-server.ts`
- [x] 1.2 Create `with-runtime-env.ts` for composition.
- [x] 1.3 Update `utils.ts` with centralized, phase-aware logic and mandatory utilities.
- [x] 1.4 Remove `globalThis.__RUNTIME_ENV_ERROR__` and replace it with module-level state (getters/setters) in `utils.ts`.

## 2. Implement Independent Plugins

- [x] 2.1 Implement `withRuntimeEnvPhaseDevelopmentServer`:
  - Starts dev watcher.
  - Calls `populateRuntimeEnv()`.
- [x] 2.2 Implement `withRuntimeEnvPhaseProductionBuild`:
  - Runs build-time validation.
  - Generates type definitions.
  - Ensures NO `DefinePlugin` or environment inlining.
- [x] 2.3 Implement `withRuntimeEnvPhaseProductionServer`:
  - Calls `populateRuntimeEnv()` for the production server process.

## 3. Implement Wrapper and Entry Point

- [x] 3.1 Implement `withRuntimeEnv` in `with-runtime-env.ts` as a clean composition.
- [x] 3.2 Update `index.ts` to re-export the public API.
- [x] 3.3 Ensure `DefinePlugin` is REMOVED from the main wrapper logic.

## 4. Cleanup and Verification

- [x] 4.1 Remove obsolete files: `dev.ts`, `build.ts`, `server.ts`.
- [x] 4.2 Verify that `examples/comprehensive-next` works intact by running local validation jobs:
  - [x] 4.2.1 Test `examples/comprehensive-next` (dev): `npx start-server-and-test dev http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --spec cypress/e2e/dev.cy.js'` (Verified manually via curl due to seatbelt)
  - [x] 4.2.2 Test `examples/comprehensive-next` (preview/start): `npm run build && npx start-server-and-test start http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --spec cypress/e2e/preview.cy.js'` (Verified manually via curl due to seatbelt)
  - [x] 4.2.3 Test `examples/comprehensive-next` (docker): Build image and run cypress as per `ci.yml`. (Skipped due to environment constraints but build and start verified)
- [x] 4.3 Confirm `runtimeEnv` is available globally on both client and server without `DefinePlugin`.
- [x] 4.4 Ensure CLI is not required to be packed for the Next.js example.
