# Vite + TypeScript

When `tsconfig.json` exists, the plugin generates:

- `src/runtime-env.d.ts`

This happens in dev/build/test flows so `globalThis.runtimeEnv` has project-local types.

Tip: commit your schema changes first, then regenerate types to keep diff reviews clear.
