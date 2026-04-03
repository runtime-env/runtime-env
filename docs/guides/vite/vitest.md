# Vitest guide

When using `@runtime-env/vite-plugin`, Vitest mode injects generated `runtime-env.js` into setup so tests can access `runtimeEnv`.

## What to verify

- `runtimeEnv` is available in tests without manual setup.
- Types are generated for editor support.

## Tips

- Keep schema keys prefixed correctly (`VITE_` by default).
- Use per-test environment values with your normal env file strategy.
