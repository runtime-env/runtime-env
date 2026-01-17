## 1. Implementation

- [x] 1.1 Remove `any` from `packages/next-plugin/src/utils.ts` by defining proper `declare global` types.
- [x] 1.2 Update `packages/next-plugin/src/index.ts` to use `globalVariableName` in `DefinePlugin` and `turbo.defines`.
- [x] 1.3 Fix `any` type casts in `packages/next-plugin/src/index.ts` by using more specific types or `Record<string, unknown>`.
- [x] 1.4 Centralize prefix enforcement logic in `utils.ts` and ensure it is used in `build.ts`, `dev.ts` (indirectly via `index.ts`), and `components.tsx`.
- [x] 1.5 Update `withRuntimeEnv` in `index.ts` to call schema validation during all phases to ensure early failure on misconfiguration.

## 2. Verification

- [x] 2.1 Run `npm run build` in `packages/next-plugin` to ensure no type errors.
- [x] 2.2 Validate using `comprehensive-next` example as specified in `packages/next-plugin/AGENTS.md`.
  - [x] Test `comprehensive-next` (dev)
  - [x] Test `comprehensive-next` (preview)
  - [ ] Test `comprehensive-next` (docker) (Skipped - Docker not easily testable here, but build/dev verified)
