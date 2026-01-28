## MODIFIED Requirements

### Requirement: Peer Dependency Requirements

The `@runtime-env/vite-plugin` SHALL define `vite` (version `*`), `vitest` (version `*`), and `@runtime-env/cli` (version `*`) as peer dependencies to ensure compatibility and avoid duplicate installations in consumer projects. It SHALL also define `vitest` as an optional peer dependency for users who wish to use the plugin with Vitest.

#### Scenario: Consumer project installation

- **GIVEN** a consumer project using Vite.
- **WHEN** the user installs `@runtime-env/vite-plugin`.
- **THEN** the package manager SHALL verify that `@runtime-env/cli` and `vite` are present in the project.
- **AND** `@runtime-env/vite-plugin` SHALL NOT install its own private copy of `@runtime-env/cli` if it's already present in the project.
- **AND** `vitest` SHALL be treated as an optional peer dependency, and its absence SHALL NOT cause errors during installation or runtime if the Vitest-specific features are not actively used.
