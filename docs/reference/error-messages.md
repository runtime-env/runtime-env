# Error messages reference

## Missing script tag

- **dev**:
  - Message indicates `index.html` is missing the runtime script and that runtime values will not be available until it is added.
  - Shown as an error/overlay during development.
- **build**:
  - Treated as a hard failure.
- **path format**:
  - default base (`"/"`): `<script src="/runtime-env.js"></script>`
  - non-root base: `<script src="${base}/runtime-env.js"></script>`
- Cause: plugin requires runtime script inclusion with a path that matches the resolved Vite base.

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
