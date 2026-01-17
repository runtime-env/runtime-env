# Design: @runtime-env/next-plugin

## Context

Next.js projects often struggle with sharing environment variables between server and client without rebuilds. `@runtime-env` solves this, but currently requires manual setup (script tags, global types). This plugin automates that for Next.js.

## Goals

- Zero-config usage via `withRuntimeEnv(nextConfig)`.
- Support for App Router and Pages Router.
- Full TypeScript support out of the box.
- Seamless integration with `next dev`, `next build`, and `next start`.

## Decisions

### 1. `runtimeEnv` via `globalThis`

- **Global Availability**: The plugin populates `globalThis.runtimeEnv` to provide the `runtimeEnv` global variable. This works natively in both Node.js (Server) and Browser (Client) environments without requiring bundler-level token replacement (like `DefinePlugin` or Turbopack `defines`).
- **Consistency**: By using `globalThis.runtimeEnv` as the single source of truth, we ensure perfect parity between client and server layers.
- **Server-Side Population**: In `next dev` and `next start`, `withRuntimeEnv` populates `globalThis.runtimeEnv` in the main Node.js process during initialization.
- **Build-Time Independence**: Since we don't use bundler `defines` to bake values into the source code, `next build` remains decoupled from environment variable values.

### 2. Zero-Config Environment Management

To avoid polluting the user's `public/` directory and ensure the latest environment variables are always available:

- **In-Memory Population**: The plugin ensures that `globalThis.runtimeEnv` is populated on the server at startup/request time.
- **Watcher (Dev Mode)**: In `next dev` mode, `withRuntimeEnv` starts a file watcher in the background to monitor environment files and `.runtimeenvschema.json`.
  - **Graceful Teardown**: The watcher (utilizing `chokidar`) SHALL be explicitly closed using `.close()` when the Next.js process is terminated or during configuration reloads to prevent resource leaks.
  - **Functionality**: When changes occur, it triggers `runtime-env gen-ts` to keep TypeScript definitions up to date.

### 3. Manual Script Injection via `<RuntimeEnvScript />`

Instead of relying on fragile and complex bundler loaders, the plugin provides a dedicated component for script injection.

- **The Component**: A `<RuntimeEnvScript />` component exported from `@runtime-env/next-plugin`.
- **Implementation**: The component SHALL use the `Script` component from `next/script` with `strategy="beforeInteractive"` (or the most appropriate strategy for early execution) to ensure `globalThis.runtimeEnv` is available before other client scripts execute.
- **Usage**: Users manually add this component to their root layout (App Router) or `_document` (Pages Router).
- **Functionality**:
  - On the server, it reads current environment variables from `process.env`.
  - It filters them based on the `.runtimeenvschema.json`.
  - It inlines the script logic to populate `globalThis.runtimeEnv`.
- **Stability**: This approach is significantly more robust as it leverages standard React/Next.js component patterns rather than manipulating source code during the build.

### 4. Cross-Version Compatibility (Next.js 13-16)

The plugin remains compatible with Next.js versions 13 through 16 by focusing on standard Next.js lifecycle hooks and components rather than internal bundler configurations.

- **On-the-fly Detection**: Instead of hardcoding logic for every version, the plugin SHALL detect the running Next.js version at runtime (e.g., by checking `next/package.json` or available APIs) and adapt its behavior dynamically.
- **Version Independence**: By avoiding `DefinePlugin` and Turbopack-specific `defines`, the plugin is inherently more resilient to internal Next.js configuration changes.
- **Component Stability**: The `<RuntimeEnvScript />` uses standard patterns that work across all supported Next.js versions.

### 5. Type Safety and Constants

- **No `any`**: The implementation SHALL NOT use the `any` type. Strict TypeScript types SHALL be defined for all configuration objects, environment variables, and internal states.
- **Next.js Constants**: The plugin SHALL use constants from `next/constants` (e.g., `PHASE_DEVELOPMENT_SERVER`, `PHASE_PRODUCTION_BUILD`) for phase-specific logic instead of hardcoded literal strings.

### 5. Security Verification (Public-Only Enforcement)

To align with Next.js's security philosophy and prevent accidental leaks, the plugin strictly limits `runtimeEnv` to public variables.

- **Strict Prefix Rejection**: The plugin SHALL inspect the `.runtimeenvschema.json` during initialization.
- **Error Trigger**: If any key in the schema does NOT start with `NEXT_PUBLIC_`, the plugin SHALL throw a descriptive Error: `[runtime-env] Configuration Error: The key '${key}' does not have the 'NEXT_PUBLIC_' prefix. @runtime-env/next-plugin only supports public environment variables. Please use 'process.env' directly for secret variables.`
- **Build-Time Safety**: This check runs during `next build`, ensuring that misconfigured projects fail early and loudly.
- **Reasoning**: Next.js already has a robust mechanism for secret variables (`process.env`). By strictly rejecting non-public keys in `runtimeEnv`, we eliminate the risk of accidental exposure in client-side bundles or hydration errors.
- **Client-Side Safety**: Since only public variables are allowed in the schema, the client-side injection is inherently safe.

### 7. Development Mode & Dev Experience

To provide a seamless developer experience, the plugin handles changes to environment variables without requiring a manual server restart.

- **File Watching**: The plugin (via `withRuntimeEnv`) monitors:
  - `.env`, `.env.local`, `.env.$(NODE_ENV)`, etc.
  - `.runtimeenvschema.json`
- **Dynamic Updates**:
  - When an environment file changes, Next.js natively reloads the dev server, which refreshes `process.env`.
  - The plugin's watcher triggers `runtime-env gen-ts` on changes to ensure TypeScript definitions remain synchronized.
- **Client-Side Refresh**: Since the environment variables are inlined in the HTML by `<RuntimeEnvScript />`, any page reload (which Next.js often triggers or which happens during navigation if the layout is involved) will provide the updated values to the client. This ensures that the client-side `globalThis.runtimeEnv` is always consistent with the server's current environment.

### 8. Testing Strategy

We will adopt a multi-layered testing strategy for `@runtime-env/next-plugin`:

1.  **Unit/Integration Tests**: Inside `packages/next-plugin`, using `jest` or `vitest` to verify the `withRuntimeEnv` configuration merging and the sidecar server logic.
2.  **E2E Verification**: Using `examples/comprehensive-next` as a testbed.
    - **Cypress**: Will be used to verify that `runtimeEnv` is correctly injected and accessible in both Server and Client Components.
    - **Mode Coverage**:
      - `next dev`: Verifies HMR and initial injection.
      - `next build` + `next start`: Verifies production optimization and late injection.
      - **Docker (Standalone)**: Verifies the final deployment artifact using `output: 'standalone'`.
3.  **CI Integration**:

## Risks / Trade-offs

- **Global Variable Overlap**: If a user already has a global `runtimeEnv`, this might conflict. However, this is the standard name for this project.

## Migration Plan

Existing Next.js users of `@runtime-env` can remove their manual script tags and type declarations after switching to `withRuntimeEnv`.

**Advanced Optimization**: For perfect consistency on the server (ensuring `runtimeEnv` only contains schema-defined keys), users are encouraged to use `instrumentation.ts` to populate `globalThis.runtimeEnv` at startup:

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { populateRuntimeEnv } =
      await import("@runtime-env/next-plugin/server");
    populateRuntimeEnv();
  }
}
```
