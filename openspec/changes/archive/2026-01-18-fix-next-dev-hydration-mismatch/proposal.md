# Change: Fix next dev hydration mismatch

## Why

In `next dev`, changing `.env` files can lead to hydration mismatches. This happens because the server-side in-memory cache of environment variables (`globalThis.runtimeEnv`) becomes stale, while the `<RuntimeEnvScript />` component might read fresh values directly from `process.env`. This inconsistency between the server-rendered HTML and the client-side hydration causes the mismatch.

## What Changes

- **Dynamic Getters in Development**: In development mode, `populateRuntimeEnv` will use `Object.defineProperty` to create getters for `globalThis.runtimeEnv` and `process.env.runtimeEnv`. These getters will dynamically filter `process.env`, ensuring they always reflect the current state of environment variables.
- **Schema Caching**: Implement an in-memory cache for the parsed schema to avoid repeated disk I/O when using dynamic getters.
- **Watcher Updates**: The development watcher will now invalidate the schema cache and re-populate the environment variables when `.env` or schema files change.
- **Consistency**: Update `RuntimeEnvScript` to use the same source of truth as SSR code.

## Impact

- Affected specs: `next-plugin`
- Affected code:
  - `packages/next-plugin/src/utils.ts`
  - `packages/next-plugin/src/with-runtime-env-phase-development-server.ts`
  - `packages/next-plugin/src/components.tsx`
