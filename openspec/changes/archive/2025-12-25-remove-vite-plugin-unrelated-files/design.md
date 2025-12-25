## Context

The current `@runtime-env/vite-plugin` implementation scatters temporary files in the project root (`./.vite-runtime-env`) and the `dist` directory (`dist/index.html.backup`). It also duplicates CLI invocation logic across different modes.

## Goals

- Clean up the project root by moving temporary files to `node_modules/.runtime-env`.
- Consolidate and improve CLI invocation logic.
- Ensure reliable cleanup of temporary files.

## Decisions

### 1. Centralized Temp Directory

- **Decision**: Use `node_modules/.runtime-env` as the base directory for all plugin-internal temporary files.
- **Rationale**: `node_modules` is standardly ignored by version control and is the appropriate place for build-related cache/temp files. It avoids cluttering the user's project root.

### 2. Refactor CLI Invocation

- **Decision**: Move `runRuntimeEnvCommand` and `getRuntimeEnvCommandLineArgs` to `utils.ts`.
- **Rationale**: This reduces code duplication and provides a single place to improve CLI resolution.

### 3. Robust CLI Resolution

- **Decision**: Use `createRequire` and `require.resolve` to find the `@runtime-env/cli` binary path instead of relying on a hardcoded `resolve("node_modules", ".bin", "runtime-env")`.
- **Rationale**: This is more robust in monorepos or when dependencies are hoisted/linked differently.

### 4. Reliable Cleanup

- **Decision**: Use `try...finally` blocks for temporary files that are only needed for a single operation (like `transformIndexHtml`).
- **Rationale**: Prevents accidental leakage of temporary files if an error occurs during the operation.

## Risks / Trade-offs

- **Risk**: If `node_modules` does not exist or is not writable, the plugin might fail.
- **Mitigation**: Fallback to a system temp directory if `node_modules` is unavailable, although in a Vite project, `node_modules` is almost certainly present.
