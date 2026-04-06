# CLI troubleshooting

## Schema file not found

Symptom: command exits because schema path cannot be resolved.

Guidance: confirm `--schema-file` path or default `.runtimeenvschema.json` exists.

## Env file not found

Symptom: command exits with env file path errors.

Guidance: verify every `--env-file` path and load order.

## Unsupported Node for `--env-file`

Symptom: `util.parseEnv is not a function`.

Guidance: use Node.js v20.12.0 or newer for `--env-file` support.

## Schema validation failures

Symptom: command reports schema/key/type issues.

Guidance: align schema keys, required fields, and provided values.

## Interpolation input issues

Symptom: interpolation runs against the wrong file or no file.

Guidance: set `--input-file` explicitly, or pass the intended input as the first positional argument.
