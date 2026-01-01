## 1. Specification Updates

- [x] 1.1 Update `openspec/specs/vite-plugin/spec.md` to change "polite warning" to "polite error" for missing script tag in Dev mode.

## 2. Implementation

- [x] 2.1 Update `packages/vite-plugin/src/dev.ts` to use `logError` instead of `logInfo` for the missing script tag check.

## 3. Validation

- [x] 3.1 Verify the change manually by running a Vite project without the script tag and ensuring an error is logged.
