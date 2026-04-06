# `gen-js`

`gen-js` generates browser runtime config JavaScript.

## Command syntax

```bash
runtime-env [top-level options] gen-js [command options]
```

## Top-level options and ordering

Top-level options are passed **before** the subcommand and apply to `gen-js` behavior:

- `--schema-file <path>`: choose schema source.
- `--global-variable-name <name>`: controls generated global object name.
- `--watch`: rerun generation when watched inputs change.

## `gen-js` command options

- `--output-file <path>`: write generated JS to this file.
- `--env-file <path...>`: load env values from one or more files.

## Typical deploy/startup usage

```bash
runtime-env --schema-file .runtimeenvschema.json gen-js --env-file .env.production --output-file ./dist/runtime-env.js
```
