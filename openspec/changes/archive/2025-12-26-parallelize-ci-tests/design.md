# Design: Parallel CI Test Execution

## Context

The project currently uses a sequential CI pipeline where a single `test` job builds, packs, and runs all tests. This is inefficient as the number of integration tests grows.

## Goals / Non-Goals

- **Goals**:
  - Reduce total wall-clock time for CI.
  - Isolate failures (failure in one example doesn't stop others, or at least makes it clear which one failed without digging through a massive log).
  - Reuse build artifacts to ensure we test exactly what we build.

- **Non-Goals**:
  - Changing the test runners (Cypress, Jest, etc.).
  - Changing the test logic itself.

## Decisions

- **Decision**: Use Separate Jobs for Each Example.
  - **Why**:
    - **Clarity**: Each job has a distinct name in the GitHub UI, making it immediately obvious which example suite failed.
    - **Simplicity**: Avoids complex matrix configuration or conditional logic within a shared script. Each job has its specific steps inline.
    - **Control**: Allows fine-tuning (e.g., timeout, runner type) for specific heavy examples (like comprehensive-vite) without affecting others.
  - **Structure**:
    - `test`: Runs root unit tests.
    - `test-example-development`: Runs `examples/development` tests.
    - `test-example-production`: Runs `examples/production` tests.
    - ...and so on for `test`, `workbox`, `comprehensive-vite`, `comprehensive-webpack`.

- **Decision**: Reuse `build` artifact.
  - **Why**: The `build` job already produces the packed `.tgz` files. Reusing them ensures consistency (we test the exact bytes we might publish) and saves time (no redundant `npm install` + `npm run build` in every test job).
  - **Mechanism**: `actions/upload-artifact` in `build` -> `actions/download-artifact` in test jobs.

- **Decision**: Remove redundant `git clean`/`restore` calls only at job start.
  - **Why**: New jobs start with a fresh environment, so the initial cleanup is unnecessary.
  - **Constraint**: However, jobs like `test-example-vite` run multiple modes (dev, test, preview) sequentially. We must **retain** the cleanup steps _between_ these modes within the same job to prevent pollution (e.g., ensuring a clean state before the `preview` test runs after the `dev` test).

- **Decision**: `test` runs in parallel with `build`.
  - **Why**: Unit tests run against source (via `ts-jest` / `vitest`), so they don't strictly require the built artifact. This further speeds up the pipeline.

## Risks / Trade-offs

- **Risk**: Verbosity in `ci.yml`.
  - **Mitigation**: While the file becomes longer, the copy-paste nature is acceptable for the benefit of explicit, isolated, and parallelizable steps.
- **Risk**: Increased runner usage (concurrent jobs).
  - **Mitigation**: GitHub Actions usually allows ample concurrency. Wall-clock time reduction is the priority.

## Migration Plan

- Edit `.github/workflows/ci.yml` directly.
- The `release` job must be updated to depend on `test` and all the new `test-example-*` jobs.
