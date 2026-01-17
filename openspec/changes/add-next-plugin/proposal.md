# Change: Add @runtime-env/next-plugin

## Why

To provide a seamless, zero-config, and **universal** experience for Next.js users. This plugin allows them to use `runtimeEnv` across all Next.js environments—Server Components (RSC), Client Components, Middleware, and API Routes—without manual script injection or configuration overhead, while maintaining full consistency with Next.js's native environment variable loading behavior and supporting all deployment modes (including standalone).

## What Changes

- **New Package**: Create `@runtime-env/next-plugin` package, with a folder structure aligned with `@runtime-env/vite-plugin` (including `AGENTS.md`, `CHANGELOG.md`, `LICENSE`, `README.md`, `src/`, etc.).
- **withRuntimeEnv**: Provide a named export `withRuntimeEnv` to wrap `NextConfig`.
  - **Phase Constants**: Use `next/constants` for all phase-specific logic (e.g., `PHASE_DEVELOPMENT_SERVER`).
  - **Dynamic Versioning**: Detect Next.js version on the fly to adapt plugin behavior.
- **Universal Support**:
  - **Routers**: Automatic support for both App Router and Pages Router.
  - **Components**: Seamless availability in both Server and Client Components.
  - **Deployment**: Full compatibility with `output: 'standalone'`.
- **Build-Time Independence**: Ensure `next build` is decoupled from environment variables; the build succeeds without `.env` files and values are never baked into the source code.
- **Automatic Type Generation**: Automatically run `runtime-env gen-ts` during development and build.
- **Global Variable**: Rely on `globalThis.runtimeEnv` to provide the `runtimeEnv` global variable in both Node.js (Server) and Browser (Client) environments, ensuring perfect parity without requiring complex bundler-specific `DefinePlugin` or `defines` configurations.
- **RuntimeEnvScript Component**: Provide a `<RuntimeEnvScript />` component that users manually add to their root layout (App Router) or document (Pages Router).
  - **next/script**: Utilize the `Script` component from `next/script` for robust client-side injection.
- **Strict Public-Only Enforcement**: To maintain Next.js's security model, the plugin SHALL strictly enforce that ONLY environment variables with the `NEXT_PUBLIC_` prefix are defined in the `runtimeEnv` schema.
  - **Schema Validation**: Any attempt to define a key without the `NEXT_PUBLIC_` prefix in `.runtimeenvschema.json` SHALL cause the plugin to throw a descriptive Error during initialization (which includes `next build`).
  - **Secret Management**: Users MUST continue to use `process.env.*` for secret (non-public) environment variables, which Next.js naturally protects from client-side exposure.
- **Technical Rigor**:
  - **No 'any'**: Strictly avoid the `any` type throughout the codebase.
  - **Graceful Teardown**: Implement clean-up logic for file watchers (e.g., closing `chokidar` instances) to prevent memory leaks and orphaned processes.
- **Environment Support**: Full support for Next.js versions 13, 14, 15, and 16 across `next dev`, `next build`, and `next start`, with automatic adaptation to breaking configuration changes (e.g., `experimental.turbo` vs. `turbopack`).
- **HMR & Dev Experience**: Automatic file watching and serving of updated environment values in development mode, ensuring changes are reflected without manual restarts.
- **E2E Testing & CI Integration**:
  - Introduce Cypress-based E2E tests in `examples/comprehensive-next`, following the `@runtime-env/vite-plugin` pattern for dev mode (verifying that `dev-updated` values are served after `.env` changes).
  - Add a dedicated CI job `test-example-next` to verify the plugin across all Next.js modes (dev, build/start, docker).

## Impact

- Affected specs: `next-plugin` (new), `comprehensive-examples-e2e` (update)
- Affected code: `packages/next-plugin` (new), `examples/comprehensive-next` (update), `.github/workflows/ci.yml` (update)
