# `interpolate`

`interpolate` replaces template placeholders in HTML/text using runtime values.

## Command syntax

```bash
runtime-env [top-level options] interpolate [command options] [inputFile]
```

## Top-level options and ordering

Top-level options are passed **before** the subcommand and affect interpolation:

- `--schema-file <path>`: defines expected keys used during resolution.
- `--global-variable-name <name>`: controls placeholder namespace (for example, `runtimeEnv`).
- `--watch`: reruns interpolation on changes.

Interpolation is a deployment/startup-time capability.

## `interpolate` command options

- `--input-file <path>`: file to read template content from.
- `--output-file <path>`: file to write interpolated content to.
- `--env-file <path...>`: env files to resolve values from.

If `--input-file` is omitted, the first positional argument is treated as the input file.

## Global-variable placeholder behavior

With default global variable name:

```html
<title><%= runtimeEnv.APP_TITLE %></title>
```

If you change `--global-variable-name`, update placeholders accordingly.

## Example

```bash
runtime-env --schema-file .runtimeenvschema.json interpolate --env-file .env.production --input-file ./dist/index.html --output-file ./dist/index.html
```
