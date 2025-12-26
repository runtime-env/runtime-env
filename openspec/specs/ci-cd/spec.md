# ci-cd Specification

## Purpose

TBD - created by archiving change parallelize-ci-tests. Update Purpose after archive.

## Requirements

### Requirement: Parallel Test Execution

The CI system SHALL execute integration tests for different examples in parallel to minimize feedback time.

#### Scenario: Pull Request

- **WHEN** a pull request is opened
- **THEN** the CI system SHALL spawn multiple parallel jobs
- **AND** each job SHALL verify a specific example or set of scenarios independently

### Requirement: Build Artifact Reuse

The CI system SHALL build packages once and reuse them across test jobs to ensure consistency and reduce build time.

#### Scenario: Test Jobs

- **GIVEN** the `build` job has completed successfully
- **WHEN** `test-examples` jobs start
- **THEN** they SHALL download the pre-built package artifacts
- **AND** they SHALL install these artifacts into the example projects
