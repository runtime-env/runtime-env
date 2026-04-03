# CLI troubleshooting

## Schema file not found

Use `--schema-file` with the correct path.

## Env file not found

Check each `--env-file` path.

## `util.parseEnv is not a function`

`--env-file` requires Node.js v20.12.0+.

## Validation errors

Inspect schema structure and required keys. See [schema rules](/reference/schema-rules).
