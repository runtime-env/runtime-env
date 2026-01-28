# Design: Safe Handling of Optional Vitest Dependency

## Context

The `@runtime-env/vite-plugin` includes a Vitest-specific plugin that automatically configures `setupFiles` for Vitest. This plugin is included in the default export of the package.
The current implementation uses a top-level `import "vitest/config"` to augment Vite's `UserConfig` type. This causes a runtime error `ERR_MODULE_NOT_FOUND` if `vitest` is not installed, even if the user is not using Vitest.

## Goals

- Prevent runtime errors when `vitest` is not installed.
- Maintain type safety (or reasonable proximity) for the plugin development.
- Keep the zero-config experience for Vitest users.

## Decisions

### 1. Remove Top-Level Side-Effect Import

We will remove `import "vitest/config"` from `vitest.ts`. This is the direct cause of the runtime error as Node.js attempts to resolve this module upon loading the plugin.

### 2. Use Safe Type Access for `config.test`

Instead of relying on the global augmentation provided by `vitest/config`, we will use a more resilient approach in `vitest.ts`:

- Define a local minimal interface for the Vitest configuration needed by the plugin.
- Cast `UserConfig` to `any` or the local interface when accessing the `test` property.

Example:

```typescript
interface VitestConfig {
  setupFiles?: string | string[];
}

// ... inside config(config: UserConfig)
const vitestConfig = (config as { test?: VitestConfig }).test || {};
```

### 3. Maintain Types for Development

We can use triple-slash directives if we want to keep types during development without forcing a runtime import, or simply rely on `any` since the usage of the Vitest config is very limited (only `setupFiles`).

## Risks / Trade-offs

- **Trade-off**: Loss of full type safety for the `config.test` object in the plugin's source code. Given that we only touch `setupFiles`, this is a low-risk trade-off.
- **Risk**: If Vitest changes the structure of `test.setupFiles`, we might miss it in type checking. However, this property is very stable in Vitest.

## Migration Plan

No migration is needed for users. This is a bug fix that makes the plugin more resilient.
