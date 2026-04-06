# `gen-ts`

`gen-ts` generates TypeScript declarations for runtime config.

## Command syntax

```bash
runtime-env [top-level options] gen-ts [command options]
```

## Top-level options and ordering

Top-level options are passed **before** the subcommand and affect `gen-ts` output:

- `--schema-file <path>`: selects which schema to read.
- `--global-variable-name <name>`: sets the generated global declaration target.
- `--watch`: watches schema changes and regenerates declarations.

`gen-ts` uses the current schema and global variable name.

## `gen-ts` command options

- `--output-file <path>`: where declaration output is written.

## Default behavior

- `--schema-file` default: `.runtimeenvschema.json`
- `--global-variable-name` default: `runtimeEnv`
- `--watch` default: off
- if `--output-file` is omitted: output is written to stdout

## Example

```bash
runtime-env --schema-file .runtimeenvschema.json --global-variable-name runtimeEnv gen-ts --output-file ./src/runtime-env.d.ts
```
