# How it works

runtime-env uses a schema-driven model.

## Schema-driven workflow

1. Define allowed runtime keys and types in `.runtimeenvschema.json`.
2. Resolve environment values against that schema.
3. Produce outputs for browser runtime and/or HTML/text templates.

## Core outputs

- `gen-js` produces browser-readable runtime config (`runtime-env.js`).
- `gen-ts` produces TypeScript declarations for the generated runtime global.
- `interpolate` substitutes runtime values into HTML/text templates.

## Plugin vs CLI

- `@runtime-env/vite-plugin` is the high-level Vite integration for dev, build, preview, and Vitest.
- `@runtime-env/cli` is the low-level, framework-agnostic runtime tool for generating config, TypeScript declarations, and interpolated HTML/text.

## After build and real runtime work

Build is the end of the Vite lifecycle.

After build, runtime config work is handled outside Vite by the CLI or other non-Vite workflows, depending on your stack.

## Accessing the generated global

The generated script assigns values to a global variable.

- The default global name is `runtimeEnv`.
- If `--global-variable-name` changes, the access name changes too.
- Docs use `runtimeEnv.FOO` as the public pattern.
