# Vite troubleshooting

## Missing runtime script tag

Symptom: runtime values are undefined.

Fix: add `<script src="/runtime-env.js"></script>` before entry script.

## Schema validation failed

Symptom: plugin exits in build/test or logs errors in dev.

Fix: check schema shape and required keys. See [schema rules](/reference/schema-rules).

## Env prefix mismatch

Symptom: values expected by schema are absent.

Fix: align Vite `envPrefix` and schema key naming strategy.
