# Change: Align comprehensive-next E2E strategy with comprehensive-vite

## Why

The current E2E test strategy for `comprehensive-next` is inconsistent with `comprehensive-vite` and `comprehensive-webpack`. It lacks detailed CI scenarios, test mode verification, and follows a different naming convention. Aligning the strategies ensures consistency across all comprehensive examples, making them easier to maintain and verify.

## What Changes

- **MODIFIED** `comprehensive-next-e2e` spec to match the structure and level of detail of `comprehensive-examples-e2e`.
- **ADDED** `Preview Mode E2E Verification (Next.js)` to test the `next build && next start` workflow, including verification that subsequent starts reflect `.env` changes.
- **ADDED** `Test Infrastructure Setup (Next.js)` and `Test Execution Independence (Next.js)` requirements.
- **UPDATED** `Docker Deployment E2E Verification (Next.js)` to include verification that subsequent container starts (from the same image) reflect environment changes.
- **UPDATED** `CI Integration for Next.js E2E` with detailed scenarios including `git clean -xdf`, tarball installation, and inline commands.
- **UPDATED** `examples/comprehensive-next/package.json` to remove any non-standard E2E scripts if they existed.
- **UPDATED** `.github/workflows/ci.yml` to use inline `start-server-and-test` commands for `comprehensive-next`, matching the pattern used for Vite and Webpack.

## Impact

- Affected specs: `comprehensive-next-e2e`
- Affected code: `examples/comprehensive-next/`, `.github/workflows/ci.yml`
