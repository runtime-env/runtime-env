# How it works

runtime-env uses a schema-driven workflow to resolve runtime values safely and produce outputs for different environments.

## Schema-driven workflow

1. Define allowed keys and types in `.runtimeenvschema.json`.
2. Resolve environment values against that schema.
3. Produce outputs for runtime JS, TypeScript declarations, and/or HTML/text templates.

## Outputs

- `gen-js` produces `runtime-env.js`.
- `gen-ts` produces TypeScript declarations.
- `interpolate` substitutes runtime values into HTML/text templates.

## Plugin vs CLI

- Use `@runtime-env/vite-plugin` during the Vite lifecycle (dev, build, preview, Vitest).
- Use `@runtime-env/cli` for framework-agnostic, low-level control.
- Runtime generation/interpolation after build happens outside Vite, or in any custom workflow.

## Accessing the generated global

The generated script assigns values to a global variable.

- By default, that variable is `runtimeEnv`.
- If `--global-variable-name` changes, the access name changes too.
- Docs intentionally use `runtimeEnv.FOO` as the public pattern.
- `globalThis.runtimeEnv` is not the main usage style in these docs.
