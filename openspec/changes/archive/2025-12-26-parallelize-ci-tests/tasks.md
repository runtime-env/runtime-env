## 1. Implementation

- [x] 1.1 Modify `.github/workflows/ci.yml` to remove the monolithic `test` job.
- [x] 1.2 Add `test` job to run unit tests (`npm run test`) and `lint` in parallel with `build`.
- [x] 1.3 Add distinct jobs for each example, configured to depend on `build` and download artifacts:
  - [x] 1.3.1 `test-example-development`
  - [x] 1.3.2 `test-example-production`
  - [x] 1.3.3 `test-example-test`
  - [x] 1.3.4 `test-example-workbox`
  - [x] 1.3.5 `test-example-vite` (covering dev, test, preview, docker; retain `git clean`/`restore` between modes)
  - [x] 1.3.6 `test-example-webpack` (covering dev, test, preview, docker; retain `git clean`/`restore` between modes)
- [x] 1.4 Update `release` job to depend on `test` and all new example test jobs.

## 2. Verification

- [x] 2.1 Trigger a CI run on the branch (if possible) or simulate locally.
- [x] 2.2 Verify that all new jobs (`test`, `test-example-*`) run.
- [x] 2.3 Verify that these jobs run in parallel.
- [x] 2.4 Verify that artifacts are correctly downloaded and used (no rebuilds).
- [x] 2.5 Verify that all tests pass.
