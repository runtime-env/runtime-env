# How it works

runtime-env uses a schema-driven model.

## Schema-driven workflow

1. Define allowed runtime keys and types in `.runtimeenvschema.json`.
2. Resolve environment values against that schema.
3. Produce outputs for browser runtime and/or deployment templates.

## Outputs

- `gen-js` produces browser-readable runtime config (`runtime-env.js`).
- `gen-ts` produces TypeScript declarations for `globalThis.runtimeEnv` (or custom global name).
- `interpolate` substitutes runtime values into HTML/text templates.

## Plugin vs CLI usage

- Use `@runtime-env/vite-plugin` during the Vite lifecycle.
- Use `@runtime-env/cli` during deployment/runtime lifecycle.

For deploy/startup template substitution, see [interpolate](/cli/interpolate).
