## ADDED Requirements

### Requirement: Peer Dependency Requirements

The `@runtime-env/vite-plugin` SHALL define `vite` (version `*`) and `@runtime-env/cli` (version `*`) as peer dependencies to ensure compatibility and avoid duplicate installations in consumer projects.

#### Scenario: Consumer project installation

- **GIVEN** a consumer project using Vite.
- **WHEN** the user installs `@runtime-env/vite-plugin`.
- **THEN** the package manager SHALL verify that `@runtime-env/cli` and `vite` are present in the project.
- **AND** `@runtime-env/vite-plugin` SHALL NOT install its own private copy of `@runtime-env/cli` if it's already present in the project.
