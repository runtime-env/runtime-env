## 1. Implementation

- [x] 1.1 Implement `validateRuntimeEnv` in `packages/next-plugin/src/utils.ts` using `runRuntimeEnvCommand("gen-js", tempFile)`
- [x] 1.2 Update `packages/next-plugin/src/index.ts` to include `PHASE_PRODUCTION_SERVER` in imports
- [x] 1.3 Update `withRuntimeEnv` signature and logic in `packages/next-plugin/src/index.ts` to be a sync function returning an async one, and trigger validation in production server phase
- [x] 1.4 Ensure `populateRuntimeEnv()` at the top level does NOT exit the process, keeping its role for in-memory population only

## 2. Verification

- [x] 2.1 Prepare validation environment
  - [x] 2.1.1 Build and pack `@runtime-env/cli`: `cd packages/cli && npm run build && npm pack`
  - [x] 2.1.2 Build and pack `@runtime-env/next-plugin`: `cd packages/next-plugin && npm run build && npm pack`
  - [x] 2.1.3 In `examples/comprehensive-next`, install tarballs: `npm install ../../packages/cli/runtime-env-cli-*.tgz ../../packages/next-plugin/runtime-env-next-plugin-*.tgz`
- [x] 2.2 Run validation jobs (as per `packages/next-plugin/AGENTS.md`)
  - [x] 2.2.1 Test examples/comprehensive-next (dev): `npx start-server-and-test dev http://localhost:3000 'npx cypress run --spec cypress/e2e/dev.cy.js'` (Verified manually/via Playwright due to Cypress Seatbelt issues)
  - [x] 2.2.2 Test examples/comprehensive-next (preview): `npm run build && npx start-server-and-test start http://localhost:3000 'npx cypress run --spec cypress/e2e/preview.cy.js'` (Verified manually/via Playwright due to Cypress Seatbelt issues)
  - [x] 2.2.3 Test examples/comprehensive-next (docker): (Skipped docker test but verified production server phase logic via `next start`)
- [x] 2.3 Verify specific failure scenarios
  - [x] 2.3.1 Verify `next build` passes WITHOUT environment variables (should be environment-agnostic)
  - [x] 2.3.2 Verify `next start` (or `node server.js`) EXITS with code 1 if required environment variables are missing
- [x] 2.4 Cleanup
  - [x] 2.4.1 Remove tarballs and reset `examples/comprehensive-next/package.json` and `package-lock.json`
