## 1. Package Scaffolding

- [ ] 1.1 Create `packages/next-plugin` directory structure.
  - [ ] 1.1.1 Add `AGENTS.md` with Next.js specific validation steps (similar to `vite-plugin/AGENTS.md`).
  - [ ] 1.1.2 Add `CHANGELOG.md` (initial entry).
  - [ ] 1.1.3 Add `LICENSE` (MIT).
  - [ ] 1.1.4 Add `README.md` with Next.js integration instructions.
  - [ ] 1.1.5 Create `src/` directory.
- [ ] 1.2 Initialize `package.json`.
  - [ ] 1.2.1 Set name to `@runtime-env/next-plugin`.
  - [ ] 1.2.2 Add `main`, `types`, `exports`, and `files` (match `@runtime-env/vite-plugin` pattern).
  - [ ] 1.2.3 Add `scripts` (`build`, `pack`).
  - [ ] 1.2.4 Add `peerDependencies` (`@runtime-env/cli`, `next`, `react`, `react-dom`).
  - [ ] 1.2.5 Add `devDependencies` (`@runtime-env/cli`, `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@types/node`, `typescript`, `rimraf`).
- [ ] 1.3 Configure `tsconfig.json` (match `@runtime-env/vite-plugin` compiler options).

## 2. Plugin Implementation

- [ ] 2.1 Implement `withRuntimeEnv` in `src/index.ts` (as the main entry point).
  - [ ] 2.1.1 Add Next.js version detection logic on the fly (runtime detection).
  - [ ] 2.1.2 Implement robust merging for `nextConfig` (sync/async/function).
  - [ ] 2.1.3 Use `next/constants` for all phase-specific logic (no literal strings).
- [ ] 2.2 Implement environment file watcher in `src/dev.ts` (triggered by `withRuntimeEnv` in dev mode, updates `runtime-env.d.ts` at the root).
  - [ ] 2.2.1 Ensure graceful teardown by closing the watcher instance on process exit.
- [ ] 2.3 Implement build-time logic in `src/build.ts` (e.g., `gen-ts` outputting to `runtime-env.d.ts` at the root, prefix validation).
- [ ] 2.4 Implement `<RuntimeEnvScript />` component in `src/components.tsx`.
  - [ ] 2.4.1 Logic to read and filter environment variables on the server.
  - [ ] 2.4.2 Use `Script` from `next/script` to inject `globalThis.runtimeEnv`.
- [ ] 2.5 Implement `populateRuntimeEnv` helper in `src/server.ts` for server-side initialization.
- [ ] 2.6 Implement descriptive error reporting.
  - [ ] 2.6.1 Capture CLI and validation errors in `src/dev.ts` and `src/build.ts`.
  - [ ] 2.6.2 Store current error state in a shared location (e.g., `globalThis.__RUNTIME_ENV_ERROR__`).
  - [ ] 2.6.3 Update `<RuntimeEnvScript />` to throw stored errors during render in dev mode to trigger the Next.js overlay.
- [ ] 2.7 Implement shared utilities in `src/utils.ts` (match `vite-plugin/src/utils.ts` for common helpers).
- [ ] 2.8 Technical Rigor: Ensure NO usage of `any` type throughout the package.

## 3. Verification & Testing

- [ ] 3.1 Create `examples/comprehensive-next` with the plugin.
- [ ] 3.2 Verify `next dev` works with zero code changes in the example.
- [ ] 3.3 Verify `next build` and `next start` work.
- [ ] 3.4 Set up Cypress E2E tests for `comprehensive-next`.
  - [ ] 3.4.1 Add `cypress`, `start-server-and-test` to `devDependencies`.
  - [ ] 3.4.2 Configure `cypress.config.js` and support files.
  - [ ] 3.4.3 Implement `cypress/e2e/dev.cy.js` (dev mode, following the `vite's dev.cy.js` pattern: verify initial values, use `cy.exec` to update `.env` to `dev-updated`, and verify it is served).
  - [ ] 3.4.4 Implement `cypress/e2e/prod.cy.js` (build/start mode).
  - [ ] 3.4.5 Implement `cypress/e2e/docker.cy.js` (Docker/standalone mode).
- [ ] 3.5 Manually verify compatibility with Next.js versions 13, 14, 15, and 16 by running basic dev/build cycles in the example with different `next` versions.

## 4. CI Integration

- [ ] 4.1 Update `.github/workflows/ci.yml`.
  - [ ] 4.1.1 Add `test-example-next` job.
  - [ ] 4.1.2 Implement steps for `dev`, `test`, `prod`, and `docker` modes.
  - [ ] 4.1.3 Ensure it uses packed tarballs from previous jobs.
- [ ] 4.2 Add `@runtime-env/next-plugin` to the `release` matrix in `ci.yml`.
