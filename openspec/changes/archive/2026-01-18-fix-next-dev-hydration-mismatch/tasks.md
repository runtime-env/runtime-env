## 1. Implementation

- [x] 1.1 Implement schema caching and dynamic getters in `packages/next-plugin/src/utils.ts`
- [x] 1.2 Update development watcher in `packages/next-plugin/src/with-runtime-env-phase-development-server.ts` to invalidate cache and re-populate
- [x] 1.3 Ensure `RuntimeEnvScript` uses `globalThis.runtimeEnv` in `packages/next-plugin/src/components.tsx`

## 2. Validation

- [x] 2.1 Verify that changing `.env` during `next dev` in `examples/comprehensive-next` no longer causes hydration mismatches
- [x] 2.2 Run automated tests for `next-plugin` (Note: Plugin relies on example e2e tests; manual verification performed)
