# Change: Update Next.js Plugin to Align with Specification

## Why

The current implementation of `@runtime-env/next-plugin` has several deviations from its specification:

1.  **Type Safety**: The codebase contains several instances of the `any` type, which violates the "No 'any'" requirement.
2.  **Prefix Enforcement**: Validation for the `NEXT_PUBLIC_` prefix is only performed during the production build phase, but the specification requires it to be enforced whenever the server starts (including development).
3.  **Security**: Missing prefix enforcement in development mode could lead to accidental exposure of secret environment variables if they are included in the schema.
4.  **Consistency**: The global variable name is hardcoded in some places instead of using the centralized `globalVariableName` constant.

## What Changes

- **MODIFIED**: `packages/next-plugin/src/index.ts` to remove `any` type casts and use the centralized `globalVariableName`.
- **MODIFIED**: `packages/next-plugin/src/utils.ts` to remove `any` type for `globalThis.runtimeEnv`.
- **MODIFIED**: `packages/next-plugin/src/build.ts` to export `validateSchema` so it can be reused.
- **MODIFIED**: `packages/next-plugin/src/index.ts` to call `validateSchema` during initialization for both development and build phases.
- **MODIFIED**: `packages/next-plugin/src/components.tsx` to ensure `getFilteredEnv` also respects the `NEXT_PUBLIC_` prefix enforcement as a secondary safety measure.

## Impact

- **Affected specs**: `next-plugin`
- **Affected code**: `packages/next-plugin/src/**/*`
- **Breaking changes**: None expected, as this aligns the implementation with existing requirements.
