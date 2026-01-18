# Change: Update Next.js Plugin Runtime Environment Substitution

## Why

Next.js executes `runtimeEnv.FOO` during `next build` (e.g., during static site generation), but `runtimeEnv` as a global variable may not be available in all build contexts or workers.
Furthermore, Next.js statically replaces `process.env.NEXT_PUBLIC_FOO` with its value during bundling. To prevent this "baking in" of environment variables and ensure dynamic access at runtime, we must use a substitution pattern that Next.js does not recognize as a static environment variable access, while still being available during the build phase.

Using `process.env.runtimeEnv` on the server-side avoids static replacement because Next.js only looks for `process.env.NEXT_PUBLIC_*`. On the client-side, using `globalThis.runtimeEnv` instead of `window.runtimeEnv` provides a more modern and robust access pattern that also works in non-browser environments if needed (though primarily targeted at browsers in this context).

## What Changes

- **MODIFIED** the `robustAccessPattern` in `withRuntimeEnv` to use `globalThis.runtimeEnv` on the client and `process.env.runtimeEnv` on the server.
- **MODIFIED** `populateRuntimeEnv` and `populateRuntimeEnvWithPlaceholders` in `utils.ts` to define `process.env.runtimeEnv` as a getter that returns `globalThis.runtimeEnv`, ensuring it behaves as an object.
- **MODIFIED** `<RuntimeEnvScript />` to inject environment variables into `globalThis.runtimeEnv` instead of `window.runtimeEnv`.
- **MODIFIED** specifications to reflect the change from `window.runtimeEnv` to `globalThis.runtimeEnv` and the use of `process.env.runtimeEnv` on the server.

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/with-runtime-env.ts`, `packages/next-plugin/src/utils.ts`, `packages/next-plugin/src/components.tsx`
- **BREAKING**: Users relying on `window.runtimeEnv` directly (instead of just `runtimeEnv`) will need to use `globalThis.runtimeEnv` or just `runtimeEnv` (which is recommended).
