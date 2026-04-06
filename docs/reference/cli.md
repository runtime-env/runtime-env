# CLI reference

## Top-level options

- `--schema-file <path>`
- `--global-variable-name <name>`
- `--watch`

Top-level options are passed before subcommands.

## Commands

- `gen-js`
  - `--env-file <path...>`
  - `--output-file <path>`
- `gen-ts`
  - `--output-file <path>`
- `interpolate`
  - `--env-file <path...>`
  - `--input-file <path>`
  - `--output-file <path>`

## Option mapping

- `--schema-file` and `--global-variable-name` affect all commands.
- `--watch` enables repeated regeneration.
- `--env-file` applies to commands that consume runtime values (`gen-js`, `interpolate`).
