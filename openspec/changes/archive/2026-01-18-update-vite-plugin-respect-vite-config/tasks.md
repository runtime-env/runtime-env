## 1. Preparation

- [x] 1.1 Read and understand Vite's `envPrefix` and `envDir` implementation details.
- [x] 1.2 Identify all locations in `packages/vite-plugin` where `envDir` is used and ensure consistency.

## 2. Implementation

- [x] 2.1 Add a utility function in `utils.ts` to validate the schema keys against allowed prefixes.
- [x] 2.2 Integrate prefix validation into `dev` mode:
  - [x] Validate on startup.
  - [x] Validate on schema file changes.
  - [x] Show HMR overlay on failure.
- [x] 2.3 Integrate prefix validation into `build` mode:
  - [x] Fail the build if validation fails.
- [x] 2.4 Integrate prefix validation into `preview` mode:
  - [x] Log errors if validation fails during runtime generation.
- [x] 2.5 Integrate prefix validation into `test` mode (Vitest):
  - [x] Fail tests if validation fails.
- [x] 2.6 Ensure `envDir` is correctly passed to `getViteEnvFiles` in all modes.

## 3. Verification

- [x] 3.1 Create a test case with a custom `envDir` and verify it's respected.
- [x] 3.2 Create a test case with a custom `envPrefix` and verify validation works for both success and failure.
- [x] 3.3 Verify HMR overlay shows the correct error message in dev mode.
- [x] 3.4 Run existing `comprehensive-vite` tests to ensure no regressions.
