## MODIFIED Requirements

### Requirement: Peer Dependency Requirements

The `@runtime-env/vite-plugin` SHALL define `vite` (version `*`) and `@runtime-env/cli` (version `*`) as peer dependencies to ensure compatibility and avoid duplicate installations in consumer projects. It SHALL also define `vitest` as an optional peer dependency for users who wish to use the plugin with Vitest.

#### Scenario: Consumer project installation

- **GIVEN** a consumer project using Vite.
- **WHEN** the user installs `@runtime-env/vite-plugin`.
- **THEN** the package manager SHALL verify that `@runtime-env/cli` and `vite` are present in the project.
- **AND** `@runtime-env/vite-plugin` SHALL NOT install its own private copy of `@runtime-env/cli` if it's already present in the project.
- **AND** `vitest` SHALL be treated as an optional peer dependency, and its absence SHALL NOT cause errors during installation or runtime if the Vitest-specific features are not actively used.

### Requirement: Vite Plugin Implementation

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience, utilizing the `apply` property for mode-specific logic and providing robust TypeScript types. It MUST ensure that optional peer dependencies like `vitest` do not cause runtime errors when they are not installed.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/vite-plugin/src` directory
- **WHEN** they view the file structure
- **THEN** they find a modular structure with logic separated by Vite mode (`dev`, `build`, `preview`, `vitest`).
- **AND** shared logic for CLI invocation and file system utilities SHALL be centralized in `utils.ts` to ensure consistency and maintainability.
- **AND** `index.ts` delegates to these modes by returning an array of plugin objects.

#### Scenario: Mode-Specific Logic with `apply`

- **GIVEN** the `@runtime-env/vite-plugin` is loaded by Vite.
- **WHEN** Vite is in `dev`, `build`, `preview`, or `test` mode.
- **THEN** only the plugins relevant to that mode SHALL be active, controlled via the `apply` property or conditional logic in the plugin array.
- **AND** the `test` mode plugin SHALL be resilient to the absence of the `vitest` package, ensuring no top-level side-effect imports of `vitest` exist that would cause runtime failures for non-Vitest users.
- **AND** it SHALL use safe type access for Vitest-specific configuration properties (like `config.test`).

#### Scenario: Maintainability

- **GIVEN** a developer needs to modify the plugin's behavior for a specific mode
- **WHEN** they locate the corresponding mode-specific file (e.g., `build.ts`)
- **THEN** they can easily understand and modify the relevant logic without affecting other modes, while utilizing shared helpers from `utils.ts` for common tasks.
