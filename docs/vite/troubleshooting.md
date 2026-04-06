# Vite troubleshooting

## Missing runtime script tag

Symptom: `globalThis.runtimeEnv` values are missing.

Guidance: add the runtime script before the app entry script.

## Wrong script path

Symptom: plugin warns or fails because the script path does not match Vite base.

Guidance: use base-aware absolute paths.

- default base: `<script src="/runtime-env.js"></script>`
- non-root base example: `<script src="/my-app/runtime-env.js"></script>`

## Schema validation failure

Symptom: errors in dev and hard failures in build/test.

Guidance: verify required keys, data types, and schema shape. See [schema rules](/reference/schema-rules).

## Env prefix mismatch

Symptom: expected values are absent at runtime.

Guidance: align Vite `envPrefix`, schema key names, and provided env variables.
