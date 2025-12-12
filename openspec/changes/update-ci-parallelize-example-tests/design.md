## Design: Parallelize example tests in CI

### Goals

- Run each example's test suite in its own CI job to reduce total wall time
- Preserve per-example environment setup (start scripts, env vars)
- Keep changes minimal and reversible

### Options Considered

1. Separate explicit jobs per example/mode
   - Pros: Each example/mode is a distinct job with clear logs and independent failure visibility. Easier to set per-job concurrency, timeouts, caching, and resource constraints.
   - Cons: More verbose workflow file, but clearer operationally.

### Recommendation

Create explicit jobs for each example and mode (no single large matrix).

### Trade-offs and Mitigations

- Flaky tests: Keep per-example retries or isolation to avoid blocking unrelated examples.
