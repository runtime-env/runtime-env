# Change: Run CI tests in parallel

## Why

The current CI workflow runs all tests sequentially in a single job. As the number of examples and test scenarios grows, the feedback loop becomes slower. Parallelizing the test execution will significantly reduce the total CI duration, allowing for faster iteration and feedback.

## What Changes

- **Refactor `.github/workflows/ci.yml`**:
  - Split the monolithic `test` job into a core `test` job (unit tests + lint) and separate jobs for each example suite (e.g., `test-example-dev`, `test-example-prod`, `test-example-vite`, etc.).
  - Download build artifacts in each test job instead of rebuilding packages.
  - Remove initial `git clean -xdf` / `git restore .` at the start of new jobs (fresh runner).
  - **Retain** `git clean` / `git restore` _between_ steps if a single job executes multiple test modes sequentially (e.g., within `test-example-vite` or `test-example-webpack`).
- **Add `ci-cd` Capability**:
  - Create `openspec/specs/ci-cd/spec.md` to define requirements for CI execution and artifact reuse.

## Impact

- **Affected specs**: `ci-cd` (new capability).
- **Affected code**: `.github/workflows/ci.yml`.
- **Developer Experience**: Faster CI feedback on PRs.
