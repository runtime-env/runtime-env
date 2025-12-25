# Change: Remove serialize-javascript entirely

## Why

Currently, the CLI uses `serialize-javascript` to serialize environment variables. This library is used to prevent XSS by escaping HTML characters by default.

However:

1. Environment variables are provided by the system/administrator, not by end-users, so they are considered trusted.
2. Escaping breaks template interpolation when values contain characters that shouldn't be escaped, such as URLs.
3. Native `JSON.stringify` is sufficient for serializing environment variables into a JavaScript file or for interpolation, as we don't need to support non-JSON types like functions or `undefined` in the final serialized output (which environment variables wouldn't naturally contain anyway).
4. Removing the library reduces the bundle size and dependency count.

## What Changes

- **BREAKING**: Remove `serialize-javascript` from the project.
- Replace all usages of `serialize-javascript` with native `JSON.stringify`.
- Update `gen-js` to use `JSON.stringify` for generating the JavaScript file.
- Update `interpolate` to use `JSON.stringify` for leaf node serialization (if needed) or handle it directly.

## Impact

- Affected specs: `cli`
- Affected code: `packages/cli/src/create-generator/json-schema.ts`, `packages/cli/package.json`
- Downstream impact: Environment variables will no longer be escaped for HTML. This is a breaking change for users relying on this behavior for security, although environment variables are typically trusted.
