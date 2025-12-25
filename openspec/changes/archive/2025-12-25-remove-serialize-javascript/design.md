# Design: Remove serialize-javascript entirely

## Context

The `runtime-env` CLI generates `runtime-env.js` and interpolates HTML templates using environment variables. It currently uses `serialize-javascript`. We want to remove this dependency and use native `JSON.stringify` instead.

## Goals

- Remove `serialize-javascript` dependency.
- Use `JSON.stringify` for all serialization needs.
- Ensure that the generated `runtime-env.js` and interpolated HTML files do not contain escaped HTML characters.

## Decisions

### 1. Replace `serializeJavascript` with `JSON.stringify`

In `parseEnv`, we will replace `serializeJavascript(value)` with `JSON.stringify(value)`.

- **Rationale**: `JSON.stringify` is a native alternative that doesn't escape HTML characters. It is sufficient for serializing the types allowed in environment variables (strings, numbers, booleans, objects, arrays).
- **Caveat**: `JSON.stringify` does not handle `undefined` in the same way (it might omit the key in an object if the value is `undefined`). However, the CLI ensures that values are validated against a schema, and `parseEnv` handles missing values based on the schema's `required` field.

### 2. Update `serializeLeafNodes` for `interpolate`

The `serializeLeafNodes` function used by `interpolate` will be updated to use `JSON.stringify`.

```typescript
  } else {
    return typeof env === "string"
      ? env // Return string directly for interpolation
      : JSON.stringify(env);
  }
```

- **Rationale**: When interpolating into an HTML template, if the value is a string, we want the raw string, not a quoted string. If it's another type (like an object), we want it stringified as JSON.

## Risks / Trade-offs

- **Security**: HTML characters in environment variables will no longer be escaped. This is acceptable as environment variables are considered trusted.
- **Serialization differences**: `serialize-javascript` handles some edge cases differently than `JSON.stringify` (e.g., regex, functions, `undefined`). These are not expected to be used in environment variables.

## Migration Plan

1. Uninstall `serialize-javascript` from `packages/cli`.
2. Update `packages/cli/src/create-generator/json-schema.ts`:
   - Remove the import of `serialize-javascript`.
   - Replace `serializeJavascript(value)` with `JSON.stringify(value)`.
   - Refactor `serializeLeafNodes` to use `JSON.stringify` appropriately.
3. Update tests in `packages/cli/src/create-generator/json-schema.test.ts` to reflect the change in output (removing escape sequences and potentially subtle differences in JSON formatting).
