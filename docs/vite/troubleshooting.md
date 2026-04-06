# Vite troubleshooting

## Missing runtime script tag

Symptom: runtime values are undefined.

Fix: add the runtime script before entry script.

- For default Vite base (`"/"`), use `<script src="/runtime-env.js"></script>`.
- For non-root Vite base, use `<script src="${base}/runtime-env.js"></script>`.

## Schema validation failed

Symptom: plugin exits in build/test or logs errors in dev.

Fix: check schema shape and required keys. See [schema rules](/reference/schema-rules).

## Env prefix mismatch

Symptom: values expected by schema are absent.

Fix: align Vite `envPrefix` and schema key naming strategy.
