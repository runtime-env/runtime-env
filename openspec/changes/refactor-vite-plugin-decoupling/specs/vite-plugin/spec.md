## MODIFIED Requirements

### Requirement: Vite Plugin Implementation

The `@runtime-env/vite-plugin` SHALL be implemented following Vite's official plugin authoring guidelines to ensure a seamless and idiomatic developer experience.

#### Scenario: Code Structure

- **GIVEN** a developer inspects the `packages/vite-plugin/src` directory
- **WHEN** they view the file structure
- **THEN** they find a modular structure with logic separated by Vite mode (`dev`, `build`, `preview`, `vitest`).
- **AND** there is no shared `utils.ts` or common runtime logic file; each mode file is self-contained.
- **AND** `index.ts` delegates to these modes by returning an array of plugin objects.

#### Scenario: Maintainability

- **GIVEN** a developer needs to modify the plugin's behavior for a specific mode
- **WHEN** they locate the corresponding mode-specific file (e.g., `build.ts`)
- **THEN** they can easily understand and modify the relevant logic without affecting other modes.
