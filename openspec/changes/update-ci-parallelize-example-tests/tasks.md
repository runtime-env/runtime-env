## Tasks

### 1. Proposal

- [x] Create `proposal.md` describing why and what changes

### 2. Implementation

- [ ] 2.1 Inspect existing workflow: `.github/workflows/ci.yml`
- [ ] 2.2 Enumerate examples and per-example modes (e.g., `comprehensive-vite` has modes A/B)
- [ ] 2.3 Add a matrix-based `examples` job to run tests per example/mode, or create a reusable workflow (`workflow_call`) that each example job invokes
- [ ] 2.4 Ensure individual jobs run `npm ci`/`npm test` in the example folder and use example-specific start scripts
- [ ] 2.5 Add caching for node_modules where appropriate

### 3. Validation

- [ ] 3.1 Run CI on a feature branch and confirm parallel jobs execute as expected
- [ ] 3.2 Verify job logs and caching behavior

### 4. Finalize

- [ ] 4.1 Update `openspec` change metadata and run `openspec validate <id> --strict`
