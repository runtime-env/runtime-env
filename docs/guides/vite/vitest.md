# Vitest guide

With `@runtime-env/vite-plugin`, Vitest mode injects a generated `runtime-env.js` setup file.
So tests can use `runtimeEnv`.

## What to check

- `runtimeEnv` exists in tests without manual setup.
- TS types are generated for editor help.

## Tips

- Keep schema keys with the right prefix (`VITE_` by default).
- Use your normal env file plan for test values.
