# Design: Vite Plugin Decoupling

## Context

The `vite-plugin` currently uses a `utils.ts` file for shared logic and a central `index.ts` that manually delegates hooks. The goal is to make each mode (dev, build, etc.) completely standalone.

## Decisions

- **Decision**: Remove `utils.ts` and duplicate shared logic (e.g., `runRuntimeEnvCommand`, `schemaFile`) into `dev.ts`, `build.ts`, `preview.ts`, and `vitest.ts`.
  - **Rationale**: While duplication violates DRY, in this specific context, the isolation of plugin modes is prioritized to prevent regression in one mode from affecting others during maintenance. It simplifies the mental model: "Everything for Build is in `build.ts`".
- **Decision**: `index.ts` returns an array of plugins `[devPlugin(), buildPlugin(), ...]`.
  - **Rationale**: This is the idiomatic Vite way to compose plugins. It allows Vite's internal logic to handle hook merging and execution order.

## Risks / Trade-offs

- **Risk**: Code duplication in `runRuntimeEnvCommand` means bug fixes to the runner must be applied in 4 places.
  - **Mitigation**: The runner logic is stable and simple (spawning a child process). If it grows complex, we might reconsider a shared internal package or strict utility library, but for now, duplication is acceptable.
