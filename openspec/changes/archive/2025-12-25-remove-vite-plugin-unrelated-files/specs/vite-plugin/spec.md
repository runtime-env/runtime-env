## MODIFIED Requirements

### Requirement: Vite Plugin Implementation

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/vite-plugin/src` directory
- **WHEN** they view the file structure
- **THEN** they find a modular structure with logic separated by Vite mode (`dev`, `build`, `preview`, `vitest`).
- **AND** shared logic for CLI invocation and file system utilities SHALL be centralized in `utils.ts` to ensure consistency and maintainability.
- **AND** `index.ts` delegates to these modes by returning an array of plugin objects.

#### Scenario: Maintainability

- **GIVEN** a developer needs to modify the plugin's behavior for a specific mode
- **WHEN** they locate the corresponding mode-specific file (e.g., `build.ts`)
- **THEN** they can easily understand and modify the relevant logic without affecting other modes, while utilizing shared helpers from `utils.ts` for common tasks.

#### Scenario: Clean Project Root

- **GIVEN** the `@runtime-env/vite-plugin` is active in any mode.
- **WHEN** the plugin needs to generate temporary files (e.g., for HTML interpolation or backups).
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output files (`runtime-env.js`, `runtime-env.d.ts`).
- **AND** `dist/index.html.backup` is ALLOWED in the `dist` directory as it is used for preview mode.
- **AND** all other temporary artifacts SHALL be stored within `node_modules/.runtime-env` to keep the project root clean.
