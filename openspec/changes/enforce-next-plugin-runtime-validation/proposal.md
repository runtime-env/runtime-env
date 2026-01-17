# Change: Enforce next-plugin Runtime Validation

## Why

To improve reliability, `@runtime-env/next-plugin` should validate environment variables at production runtime and exit early if they are missing or incorrect. This follows 12-factor app best practices. Additionally, the `withRuntimeEnv` wrapper should be refined to ensure compatibility with Next.js configuration patterns and avoid potential issues with `async` return types in some versions of Next.js.

## What Changes

### @runtime-env/next-plugin

- **ADDED** `validateRuntimeEnv` in `utils.ts` to perform environment validation using the existing `gen-js` CLI command with a temporary output.
- **MODIFIED** `withRuntimeEnv` in `index.ts` to:
    - Return a synchronous function that returns a `Promise<NextConfig>`, matching the most compatible Next.js plugin pattern.
    - Call `validateRuntimeEnv` only during the `PHASE_PRODUCTION_SERVER` phase.
- **MODIFIED** `Informative and Resilient Integration (Next.js)` requirement to include process exit in production startup.

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/utils.ts`, `packages/next-plugin/src/index.ts`
- Fixes CI failures related to Next.js configuration loading and process lifecycle.
