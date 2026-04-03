# CLI reference

## Install

```bash
npm i -D @runtime-env/cli
```

## Shared options

- `--global-variable-name`
- `--schema-file`
- `--watch`

## Commands

### `gen-js`

Makes runtime JavaScript to stdout or `--output-file`.

Options:

- `--env-file <envFile...>` (uses Node `util.parseEnv`; needs Node 20.12+)
- `--output-file <path>`

### `gen-ts`

Makes TypeScript declarations to stdout or `--output-file`.

### `interpolate`

Interpolates templates with lodash template syntax and your global variable name.

Options:

- `--env-file <envFile...>`
- `--input-file <path>`
- `--output-file <path>`

## Notes

- Non-string schema values are parsed from env text with JSON.
- Schema `default` is not allowed.
