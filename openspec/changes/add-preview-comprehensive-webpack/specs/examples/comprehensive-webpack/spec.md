## ADDED Requirements

### Requirement: Preview feature for comprehensive-webpack example

The examples repository SHALL provide a `preview` command or equivalent for the `comprehensive-webpack` example that starts a local preview server showing the built output, matching the UX provided by the `comprehensive-vite` example.

#### Scenario: Start preview server

- **WHEN** a contributor runs the preview command from the `comprehensive-webpack` example directory
- **THEN** a local server SHALL start and serve the built output for manual inspection
- **AND** instructions to stop the server SHALL be documented in the example README
