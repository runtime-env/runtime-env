# Vite test

In test mode, the plugin keeps runtime behavior aligned with app expectations.

## What it does in tests

- validates schema before test execution,
- generates `runtime-env.js` for test runtime access,
- injects a Vitest setup file entry so runtime config is available in tests,
- generates `src/runtime-env.d.ts` for TypeScript projects.

If test runs fail due to config mismatch, validate schema keys and test env values first.
