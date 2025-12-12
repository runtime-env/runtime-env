# Change: Update CI to run examples' tests in parallel jobs

## Why

The repository's CI runs examples' tests in a waterfall (queued) sequence which increases total CI wall time and slows feedback. Parallelizing example test runs into their own jobs will reduce overall runtime and surface failures earlier.

## What Changes

- Modify CI workflow(s) to run each example's tests in separate jobs (one job per example, and multiple jobs per-example when that example requires multiple modes).
- Prefer a `matrix.include` approach or reusable workflow (`workflow_call`) to represent examples and modes explicitly.
- Add appropriate caching, concurrency limits, and test grouping so cost remains controlled.

## Impact

- Affected workflows: .github/workflows/ci.yml
- Developer impact: Faster feedback; CI may run more parallel runners (cost considerations)

## Rollout

- Implement change behind a short-lived feature branch and monitor CI job concurrency and billing.
- Optionally gate parallelism per branch (e.g., limit on PRs vs main)
