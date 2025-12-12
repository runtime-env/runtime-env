## Design: Parallelize example tests in CI

### Goals

- Run each example's test suite in its own CI job to reduce total wall time
- Preserve per-example environment setup (start scripts, env vars)
- Keep changes minimal and reversible

### Options Considered

1. Matrix job in `.github/workflows/ci.yml`
   - Pros: Simple single-file change; easy to enumerate examples and modes via `matrix.include`.
   - Cons: Large matrix may produce many concurrent jobs; less reusable between workflows.

### Recommendation

Start with a `matrix.include` approach in `.github/workflows/ci.yml` listing `{example,mode}` pairs so we can quickly rollout and measure concurrency.

### Trade-offs and Mitigations

- Flaky tests: Keep per-example retries or isolation to avoid blocking unrelated examples.
