# Error messages reference

## Missing script tag

- Message: `index.html is missing <script src="/runtime-env.js"></script>`
- Cause: plugin requires runtime script inclusion.

## Invalid schema

- Message prefix: `schema is invalid:`
- Cause: schema shape/rule violations.

## Schema prefix mismatch (Vite)

- Cause: schema keys do not align with Vite env prefix expectations.

## Missing env file

- Message prefix: `env file not found:`
- Cause: wrong `--env-file` path.

## Unsupported Node for `--env-file`

- Message: `util.parseEnv is not a function`
- Cause: Node older than v20.12.0.
