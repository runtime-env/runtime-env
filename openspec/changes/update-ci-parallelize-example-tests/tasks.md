## Tasks

### 1. Proposal

- [x] Create `proposal.md` describing why and what changes

### 2. Implementation

- [x] 2.1 Inspect existing workflow: `.github/workflows/ci.yml`
- [x] 2.2 Enumerate examples and per-example modes (e.g., `comprehensive-vite` has modes A/B)
- [x] 2.3 Create explicit separate jobs for each example/mode (do not use a single large matrix).
- [x] 2.4 Ensure individual jobs run `npm ci`/`npm test` in the example folder and use example-specific start scripts
- [x] 2.5 Add caching for node_modules where appropriate

### 3. Validation

- [x] 3.1 Run CI on a feature branch and confirm parallel jobs execute as expected
- [x] 3.2 Verify job logs and caching behavior

### 4. Finalize

- [x] 4.1 Update `openspec` change metadata and run `openspec validate <id> --strict`
