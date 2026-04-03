# CLI reference

## Package

```bash
npm i -D @runtime-env/cli
```

## Shared options

- `--global-variable-name`
- `--schema-file`
- `--watch`

## Commands

### `gen-js`

Generate runtime JavaScript to stdout or `--output-file`.

Options:
- `--env-file <envFile...>` (uses Node `util.parseEnv`; requires Node 20.12+ when used)
- `--output-file <path>`

### `gen-ts`

Generate TypeScript declarations to stdout or `--output-file`.

### `interpolate`

Interpolate templates using lodash template syntax and the selected global variable name.

Options:
- `--env-file <envFile...>`
- `--input-file <path>`
- `--output-file <path>`

## Notes

- Non-string schema values are parsed from env values as JSON.
- Schema `default` is prohibited.
