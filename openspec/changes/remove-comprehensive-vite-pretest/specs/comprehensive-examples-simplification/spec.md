## ADDED Requirements

### Requirement: Refactor Comprehensive Vite Example

The `comprehensive-vite` example SHALL be refactored to use the new `@runtime-env/vite-plugin` plugin, serving as a best-practice reference for users, and its `package.json` scripts SHALL be simplified.

#### Scenario: `comprehensive-vite` `package.json` scripts are simplified

- **GIVEN** the `comprehensive-vite` example.
- **WHEN** a developer inspects `package.json` scripts.
- **THEN** the `pretest` script SHALL NOT be present.
- **AND** the `test` script SHALL execute `vitest --run`.
