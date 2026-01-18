## Context

Next.js's static environment variable replacement (replacing `process.env.NEXT_PUBLIC_FOO` with its literal value at build time) interferes with `@runtime-env/next-plugin`'s goal of providing dynamic runtime environment variables.
Additionally, `runtimeEnv` accesses during `next build` (e.g. for static generation) fail if the global `runtimeEnv` is not yet defined in the Node.js process.

## Goals

- Prevent Next.js from statically replacing environment variable accesses in the bundle.
- Ensure `runtimeEnv` accesses work during the build phase.
- Use a modern access pattern (`globalThis.runtimeEnv`) on the client.

## Decisions

### Decision: Use `process.env.runtimeEnv` as the substitution target on the server

By replacing the symbol `runtimeEnv` with `process.env.runtimeEnv` in the bundle, we ensure that:

1. Accesses look like `process.env.runtimeEnv.NEXT_PUBLIC_FOO`.
2. Next.js's static replacement logic (which targets `process.env.NEXT_PUBLIC_*`) does not match these accesses.

### Decision: Define `process.env.runtimeEnv` as a getter

To make `process.env.runtimeEnv` behave as an object (instead of a stringified `[object Object]` which is the default for `process.env` properties), we use `Object.defineProperty` to create a getter that returns `globalThis.runtimeEnv`.

```javascript
Object.defineProperty(process.env, "runtimeEnv", {
  get() {
    return globalThis.runtimeEnv;
  },
  enumerable: true,
  configurable: true,
});
```

This ensures that `process.env.runtimeEnv.FOO` works correctly in Node.js environments (both during build and at runtime on the server).

### Decision: Use `globalThis.runtimeEnv` on the client

`globalThis` is the modern standard for accessing the global object across different JavaScript environments. It replaces `window` for client-side environment variable storage.

## Risks / Trade-offs

- **Risk**: Some extremely old browsers might not support `globalThis` (can be polyfilled if needed, but Next.js projects usually target modern browsers or provide polyfills).
- **Risk**: Accessing `process.env.runtimeEnv` might still trigger some internal Next.js warnings or optimizations if they ever expand their static replacement logic to nested properties of `process.env`.
