## 1. CLI Implementation

- [x] 1.1 Implement schema traversal to check for the prohibited `default` keyword in `packages/cli/src/create-generator/json-schema.ts`
- [x] 1.2 Add validation logic to `parseEnv` function to throw an error if `default` is found
- [x] 1.3 Update `generateTs` to also perform this check to prevent generation from invalid schemas
- [x] 1.4 Add unit tests in `packages/cli/tests/` to verify the new validation logic

## 2. Agent Skills Update

- [x] 2.1 Update `skills/runtime-env-vite-plugin/SKILL.md` to include the prohibition of the `default` keyword
- [x] 2.2 Verify the skill update matches the delta spec

## 3. Verification

- [x] 3.1 Run `npm test` in `packages/cli` to ensure all tests pass
- [x] 3.2 Verify with a manual test using one of the examples (e.g., `examples/comprehensive-vite`) by adding a `default` keyword and checking for the error
