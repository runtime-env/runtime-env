# How it works

runtime-env uses a schema-driven model.

1. Define allowed runtime keys in `.runtimeenvschema.json`.
2. Generate `runtime-env.js` from env values.
3. Load the script in HTML.
4. Read values from `globalThis.runtimeEnv`.

Optional: interpolate template placeholders into HTML/text with the CLI `interpolate` command.

## Core outputs

- JavaScript runtime payload (`gen-js`)
- TypeScript definitions (`gen-ts`)
- Interpolated templates (`interpolate`)
