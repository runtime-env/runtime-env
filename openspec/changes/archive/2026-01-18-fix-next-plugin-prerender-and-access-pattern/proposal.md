# Change: Fix next-plugin prerender and transition to robust access pattern

## Why

The current `globalThis.runtimeEnv` access pattern in `@runtime-env/next-plugin` is problematic during Next.js prerendering (build time). Next.js sometimes optimizes or replaces `globalThis` or its properties during static generation, and if `runtimeEnv` is not explicitly populated during the build phase, it can lead to crashes or empty values. Furthermore, `globalThis.runtimeEnv` is not the most idiomatic way to access environment variables in Next.js.

Using `process.env.runtimeEnv` (on the server) and `window.runtimeEnv` (on the client) provides a more robust and reliable access pattern that avoids accidental build-time inlining by Next.js's compiler (since it's not a direct `process.env.NEXT_PUBLIC_*` access) while remaining available during all phases, including prerendering.

## What Changes

- **MODIFIED** `next-plugin` to populate `process.env.runtimeEnv` on the server.

- **MODIFIED** `next-plugin` to populate `window.runtimeEnv` on the client via `RuntimeEnvScript`.

- **MODIFIED** `next-plugin` to populate these variables with **placeholders** during `PHASE_PRODUCTION_BUILD` to ensure they are available for prerendering without baking real secrets/values into static pages.

- **ADDED** Webpack `DefinePlugin` and Turbopack `string-replace-loader` configuration to the plugin to automatically replace `runtimeEnv` with a robust access pattern (`(typeof window !== 'undefined' ? window : process.env).runtimeEnv`). This allows users to continue using `runtimeEnv` in their code while benefiting from improved build-time stability. Utilizing `string-replace-loader` for Turbopack aligns with official Next.js recommendations for custom code transformations in the Turbo engine.

- **SUPPORTED** Next.js 13 to 16, ensuring the access pattern works across different versions and both Webpack and Turbopack.

## Impact

- Affected specs: `next-plugin`.

- Affected code: `packages/next-plugin`, `examples/comprehensive-next`.

- **STABLE**: Users can continue using `runtimeEnv.X` in their code. The plugin handles the robust mapping automatically.

- **COMPATIBLE**: Works with all supported Next.js configurations from version 13 to 16, including Turbopack and Webpack.
