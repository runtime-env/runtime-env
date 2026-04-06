# Error messages reference

## Missing script tag (Vite)

- **dev**: error/overlay indicates `index.html` is missing runtime script and runtime values will not be available.
- **build/test**: treated as hard failure.
- **path examples**:
  - default base: `<script src="/runtime-env.js"></script>`
  - non-root base example: `<script src="/my-app/runtime-env.js"></script>`

## Invalid schema

- Message prefix: `schema is invalid:`
- Cause: schema shape/rule violations.

## Schema prefix mismatch (Vite)

- Cause: schema keys do not align with Vite env prefix strategy.

## Missing env file

- Message prefix: `env file not found:`
- Cause: incorrect `--env-file` path.

## Unsupported Node for `--env-file`

- Message: `util.parseEnv is not a function`
- Cause: Node older than v20.12.0.

## Interpolation input issues

- Cause: missing or wrong interpolation input path.
- Guidance: use `--input-file` or provide the first positional input argument.
