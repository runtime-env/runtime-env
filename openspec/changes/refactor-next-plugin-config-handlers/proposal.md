# Change: Refactor Next.js Plugin Config Handlers

## Why

The current `with-runtime-env.ts` file in `packages/next-plugin` contains monolithic logic for handling both Webpack and multiple versions of Turbopack configuration. This makes the code harder to read, maintain, and test. Separating these concerns into distinct modules will improve code clarity and allow for easier updates as Next.js evolves.

## What Changes

- Extract Webpack configuration logic into `src/with-runtime-env-webpack.ts`.
- Extract `experimental.turbo` configuration logic (Next.js < 15.3.0) into `src/with-runtime-env-experimental-turbo.ts`.
- Extract `turbopack` root configuration logic (Next.js 15.3.0+) into `src/with-runtime-env-turbopack.ts`.
- Refactor `src/with-runtime-env.ts` to compose these new modules.
- Encapsulate version checking logic within each configuration handler, ensuring they self-regulate based on the installed Next.js version.

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/`
