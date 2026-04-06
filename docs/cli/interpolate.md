# `interpolate`

`interpolate` substitutes runtime values into HTML/text templates.

## Command syntax

```bash
runtime-env [top-level options] interpolate [command options] [rawInput]
```

## Top-level options and ordering

Top-level options are passed **before** the subcommand and affect interpolation behavior:

- `--schema-file <path>`: defines expected keys used during resolution.
- `--global-variable-name <name>`: controls placeholder namespace (for example, `runtimeEnv`).
- `--watch`: reruns interpolation on changes.

Interpolation is useful for deployment/startup workflows and for any custom workflow that needs template substitution.

## `interpolate` command options

- `--input-file <path>`: read template content from a file.
- `--output-file <path>`: write interpolated content to a file.
- `--env-file <path...>`: load values from one or more env files.

Interpolation uses the global variable name in templates (for example, `<%= runtimeEnv.APP_TITLE %>` by default).

## Default behavior

- `--schema-file` default: `.runtimeenvschema.json`
- `--global-variable-name` default: `runtimeEnv`
- `--watch` default: off
- if `--env-file` is omitted: values come from the current process environment
- if `--output-file` is omitted: output is written to stdout
- if `--input-file` is omitted: the first positional argument is treated as the raw input string, not a file path
- if both env files and process environment are used: process environment wins

## Example

```bash
runtime-env --schema-file .runtimeenvschema.json interpolate --env-file .env.production --input-file ./dist/index.html --output-file ./dist/index.html
```
