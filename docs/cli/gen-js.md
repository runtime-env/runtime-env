# `gen-js`

`gen-js` generates browser runtime config JavaScript.

## Command syntax

```bash
runtime-env [top-level options] gen-js [command options]
```

## Top-level options and ordering

Top-level options are passed **before** the subcommand and affect `gen-js` behavior:

- `--schema-file <path>`: choose schema source.
- `--global-variable-name <name>`: controls generated global object name.
- `--watch`: rerun generation when watched inputs change.

## `gen-js` command options

- `--output-file <path>`: write generated JS to a file.
- `--env-file <path...>`: load env values from one or more env files.

## Default behavior

- `--schema-file` default: `.runtimeenvschema.json`
- `--global-variable-name` default: `runtimeEnv`
- `--watch` default: off
- if `--env-file` is omitted: values come from the current process environment
- if `--output-file` is omitted: output is written to stdout
- if both env files and process environment are used: process environment wins

`gen-js` is useful for development, staging, deployment/runtime, and other custom workflows.

## Nested JSON example

Schema:

```json
{
  "type": "object",
  "properties": {
    "FEATURE_FLAGS": {
      "type": "object",
      "properties": {
        "betaCheckout": { "type": "boolean" }
      },
      "required": ["betaCheckout"]
    }
  },
  "required": ["FEATURE_FLAGS"]
}
```

Env value:

```bash
FEATURE_FLAGS={"betaCheckout":true}
```

## Example

Stage-specific API URL generated for a local/staging workflow:

```bash
runtime-env --schema-file .runtimeenvschema.json gen-js --env-file .env.staging --output-file ./public/runtime/runtime-env.js
```
