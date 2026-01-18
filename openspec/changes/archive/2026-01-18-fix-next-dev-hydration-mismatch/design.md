# Design: Fix next dev hydration mismatch

## Context

In `next dev`, Next.js automatically reloads environment variables from `.env` files into `process.env`. However, `@runtime-env/next-plugin` currently populates `globalThis.runtimeEnv` and `process.env.runtimeEnv` once during configuration loading. If `.env` files change and the server doesn't fully restart (or if workers are not re-synchronized), `runtimeEnv` becomes stale on the server while it might be fresh in the injected `<RuntimeEnvScript />`, leading to hydration mismatches.

## Goals

- Ensure `runtimeEnv` is always fresh on the server in development mode.
- Guarantee consistency between SSR and client-side hydration.
- Maintain performance by avoiding unnecessary disk I/O.

## Decisions

### 1. Dynamic Getters in Development

Instead of setting static objects, we will use `Object.defineProperty` to set up getters for `globalThis.runtimeEnv` and `process.env.runtimeEnv` when `process.env.NODE_ENV === 'development'`.

```typescript
Object.defineProperty(globalThis, "runtimeEnv", {
  get() {
    return getFilteredEnv(process.cwd());
  },
  configurable: true,
  enumerable: true,
});
```

This ensures that any access on the server always pulls the latest values from `process.env`.

### 2. Schema Caching

To avoid parsing the `.runtimeenvschema.json` on every access, we will implement a simple in-memory cache for the parsed schema in `utils.ts`.

```typescript
let cachedSchema: any = null;

export function getFilteredEnv(rootDir: string) {
  if (!cachedSchema) {
    // Load and parse schema...
    cachedSchema = ...;
  }
  // Use cachedSchema to filter process.env...
}
```

### 3. Cache Invalidation via Watcher

The existing dev watcher in `with-runtime-env-phase-development-server.ts` will be updated to clear `cachedSchema` whenever the schema file changes. It will also re-trigger `populateRuntimeEnv` to ensure the getters are properly established if they were somehow overwritten or if the root directory changed.

### 4. Consistent Script Injection

`RuntimeEnvScript` will be updated to prefer `(globalThis as any).runtimeEnv` on the server. Since we've ensured `globalThis.runtimeEnv` is fresh via getters, this guarantees that the script injected into the HTML matches what the rest of the server-side code (SSR) used.

## Risks / Trade-offs

- **Performance**: Getters add a small overhead compared to static objects. However, with schema caching, this is negligible in development mode.
- **Complexity**: `Object.defineProperty` is slightly more complex than simple assignment but is standard JavaScript and highly effective for this use case.
