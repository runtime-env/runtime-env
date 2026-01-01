## MODIFIED Requirements

### Requirement: Vite Plugin Implementation

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience, utilizing the `apply` property for mode-specific logic and providing robust TypeScript types.

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
- **AND** the `test` mode plugin SHALL leverage official Vitest types to ensure type safety without `any` casts.

#### Scenario: Maintainability

- **GIVEN** a developer needs to modify the plugin's behavior for a specific mode
- **WHEN** they locate the corresponding mode-specific file (e.g., `build.ts`)
- **THEN** they can easily understand and modify the relevant logic without affecting other modes, while utilizing shared helpers from `utils.ts` for common tasks.
