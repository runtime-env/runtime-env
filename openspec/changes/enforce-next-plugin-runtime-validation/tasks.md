## 1. Implementation

- [ ] 1.1 Implement `validateRuntimeEnv` in `packages/next-plugin/src/utils.ts` using `runRuntimeEnvCommand("gen-js", tempFile)`
- [ ] 1.2 Update `packages/next-plugin/src/index.ts` to include `PHASE_PRODUCTION_SERVER` in imports
- [ ] 1.3 Update `withRuntimeEnv` signature and logic in `packages/next-plugin/src/index.ts` to be a sync function returning an async one, and trigger validation in production server phase
- [ ] 1.4 Ensure `populateRuntimeEnv()` at the top level does NOT exit the process, keeping its role for in-memory population only

## 2. Verification

- [ ] 2.1 Prepare validation environment
    - [ ] 2.1.1 Build and pack `@runtime-env/cli`: `cd packages/cli && npm run build && npm pack`
    - [ ] 2.1.2 Build and pack `@runtime-env/next-plugin`: `cd packages/next-plugin && npm run build && npm pack`
    - [ ] 2.1.3 In `examples/comprehensive-next`, install tarballs: `npm install ../../packages/cli/runtime-env-cli-*.tgz ../../packages/next-plugin/runtime-env-next-plugin-*.tgz`
- [ ] 2.2 Run validation jobs (as per `packages/next-plugin/AGENTS.md`)
    - [ ] 2.2.1 Test examples/comprehensive-next (dev): `npx start-server-and-test dev http://localhost:3000 'npx cypress run --spec cypress/e2e/dev.cy.js'`
    - [ ] 2.2.2 Test examples/comprehensive-next (preview): `npm run build && npx start-server-and-test start http://localhost:3000 'npx cypress run --spec cypress/e2e/preview.cy.js'`
    - [ ] 2.2.3 Test examples/comprehensive-next (docker): `docker build . -t comprehensive-next && npx start-server-and-test 'docker run -p 3000:3000 -e NEXT_PUBLIC_FOO=docker-test comprehensive-next' 3000 'npx cypress run --spec cypress/e2e/docker.cy.js'`
- [ ] 2.3 Verify specific failure scenarios
    - [ ] 2.3.1 Verify `next build` passes WITHOUT environment variables (should be environment-agnostic)
    - [ ] 2.3.2 Verify `next start` (or `node server.js`) EXITS with code 1 if required environment variables are missing
- [ ] 2.4 Cleanup
    - [ ] 2.4.1 Remove tarballs and reset `examples/comprehensive-next/package.json` and `package-lock.json`
