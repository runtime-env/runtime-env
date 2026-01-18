## 1. Implementation

- [x] 1.1 Create `packages/next-plugin/src/with-runtime-env-webpack.ts` to handle Webpack `DefinePlugin` injection.
- [x] 1.2 Create `packages/next-plugin/src/with-runtime-env-experimental-turbo.ts` with internal version check (Next.js < 15.3.0).
- [x] 1.3 Create `packages/next-plugin/src/with-runtime-env-turbopack.ts` with internal version check (Next.js 15.3.0+).
- [x] 1.4 Implement version detection utility (e.g. `getNextVersion()`) for use by configuration handlers.
- [x] 1.5 Refactor `packages/next-plugin/src/with-runtime-env.ts` to unconditionally compose the handlers, relying on their internal version checks.
- [x] 1.6 Verify changes by running validation jobs locally (e.g. `examples/comprehensive-next`).