## 1. Implementation

- [x] 1.1 Uninstall `serialize-javascript` from `packages/cli`.
- [x] 1.2 Update `packages/cli/src/create-generator/json-schema.ts` to replace `serializeJavascript` with `JSON.stringify`.
- [x] 1.3 Refactor `serializeLeafNodes` in `packages/cli/src/create-generator/json-schema.ts` to use `JSON.stringify`.
- [x] 1.4 Update tests in `packages/cli/src/create-generator/json-schema.test.ts` to reflect the changes.
- [x] 1.5 Update other tests in `packages/cli/tests/` if they are affected by serialization changes.

## 2. Validation

- [x] 2.1 Run `npm run test` in `packages/cli` to ensure all tests pass.
- [x] 2.2 Verify that example projects still work as expected.
