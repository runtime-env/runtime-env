## ADDED Requirements

### Requirement: CI runs each example's tests in separate jobs

The CI system SHALL execute each example's test suite in an independent job so that example test execution runs in parallel where runners/resources allow.

#### Scenario: Parallel example jobs on push

- **WHEN** a push occurs to the repository
- **THEN** the CI workflow SHOULD schedule one job per example (and per-mode where applicable)
- **AND** each job SHOULD run the example's setup, test steps, and publish results independently
