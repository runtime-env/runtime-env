# Design: Refactor next-plugin phases

## Context

The current implementation of `withRuntimeEnv` in `index.ts` handles multiple Next.js phases and contains significant logic. As the plugin grows, this file becomes harder to maintain. Additionally, the current use of `webpack.DefinePlugin` to inject a `Proxy` for `runtimeEnv` is considered unnecessary given that `runtimeEnv` can be directly managed via `globalThis`.

## Goals

- Encapsulate phase-specific logic into independent internal plugins.
- Minimal `index.ts` serving only as a public API entry point.
- Clear separation of concerns between development, build, and production server phases.
- **Simplify `runtimeEnv` access**: Rely on `globalThis.runtimeEnv` instead of complex `DefinePlugin` replacements.
- **Maintain example and CI integrity**: Ensure `examples/comprehensive-next` continues to work without changes and all related CI jobs pass locally.

## Decisions

### File Structure

```
packages/next-plugin/src/
├── index.ts                                         # Re-exports withRuntimeEnv and RuntimeEnvScript
├── with-runtime-env.ts                              # Composes internal phase plugins
├── with-runtime-env-phase-development-server.ts     # Internal plugin for PHASE_DEVELOPMENT_SERVER
├── with-runtime-env-phase-production-build.ts       # Internal plugin for PHASE_PRODUCTION_BUILD
├── with-runtime-env-phase-production-server.ts      # Internal plugin for PHASE_PRODUCTION_SERVER
├── components.tsx                                   # React components (RuntimeEnvScript)
└── utils.ts                                         # Shared utilities
```

### Composition Pattern

`withRuntimeEnv` in `with-runtime-env.ts` will be a composition:

```typescript
export function withRuntimeEnv(nextConfig) {
  return (phase, context) => {
    // ... logic to resolve nextConfig ...
    return withRuntimeEnvPhaseDevelopmentServer(
      withRuntimeEnvPhaseProductionBuild(
        withRuntimeEnvPhaseProductionServer(resolvedConfig, phase),
        phase,
      ),
      phase,
    );
  };
}
```

### Simplification of `runtimeEnv` Injection

- **STOP** using `DefinePlugin` or `experimental.turbo.defines` to replace `runtimeEnv` with a `Proxy` or any other complex expression.
- **KEEP** the source code syntax `runtimeEnv` (or `globalThis.runtimeEnv`) intact.
- **STRICT GLOBAL NAMESPACE**: Only `globalThis.runtimeEnv` is permitted to be added to the global object. Internal flags or error states, such as the former `__RUNTIME_ENV_ERROR__`, must be managed through module-level state within `utils.ts`.
- **SERVER-SIDE**: `populateRuntimeEnv()` will be called during `PHASE_DEVELOPMENT_SERVER` and `PHASE_PRODUCTION_SERVER` to set `globalThis.runtimeEnv`. Since `next.config.ts` is loaded by the Next.js server, this ensures availability in the server process.
- **CLIENT-SIDE**: `RuntimeEnvScript` continues to inject `globalThis.runtimeEnv` via a `<script>` tag.
- **NO INLINING**: Ensure no environment variables are baked into the build output during `PHASE_PRODUCTION_BUILD`.

### CLI Packing

- **Next.js does NOT require the CLI to be packed** into the production output (e.g., as a SEA or standalone binary) because it runs in a Node.js environment where the plugin can directly manage environment variables or call the CLI via standard `node` invocation if needed during build-time tasks (like generating type definitions).

### Removed Files

- `packages/next-plugin/src/server.ts`: Logic moved to `utils.ts` or handled by phase-specific plugins.
- `packages/next-plugin/src/dev.ts`: Logic moved to `with-runtime-env-phase-development-server.ts`.
- `packages/next-plugin/src/build.ts`: Logic moved to `with-runtime-env-phase-production-build.ts`.

## Risks / Trade-offs

- Relying on `globalThis.runtimeEnv` requires that `populateRuntimeEnv()` is called early enough. If users have code that accesses `runtimeEnv` at the module top-level before `next.config.ts` is fully processed, it might be `undefined`. However, standard Next.js usage (Pages, Components) should be safe.
- Removing `DefinePlugin` means `runtimeEnv` must be recognized as a global by compilers/linters. The project already provides a `.d.ts` for this.
