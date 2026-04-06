# How it works

runtime-env uses a schema-driven model.

## Schema-driven workflow

1. Define allowed runtime keys and types in `.runtimeenvschema.json`.
2. Resolve environment values against that schema.
3. Produce outputs for browser runtime and/or deployment templates.

## Outputs

- `gen-js` produces browser-readable runtime config (`runtime-env.js`).
- `gen-ts` produces TypeScript declarations for the generated runtime global.
- `interpolate` substitutes runtime values into HTML/text templates.

## Plugin vs CLI usage

- Use `@runtime-env/vite-plugin` during the Vite lifecycle.
- Use `@runtime-env/cli` for framework-agnostic low-level control across deployment/runtime lifecycle and custom workflows.

For template substitution workflows, see [interpolate](/cli/interpolate).

## Accessing the generated global

The generated runtime script creates a global variable.

- By default, that variable is `runtimeEnv`.
- If `--global-variable-name` is changed, the access name changes too.
- For readability, docs examples use `runtimeEnv.FOO` as the main user-facing pattern.
