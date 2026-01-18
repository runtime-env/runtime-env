## MODIFIED Requirements

### Requirement: Cross-Version Compatibility (Next.js 13-16)

The plugin SHALL support Next.js versions 13, 14, 15, and 16 by automatically detecting the running version and adapting to its lifecycle and component patterns.

#### Scenario: On-the-fly version detection

- **GIVEN** a supported version of Next.js
- **WHEN** the plugin initializes
- **THEN** it SHALL detect the Next.js version dynamically at runtime using the `next` CLI
- **AND** it SHALL adapt its internal configuration (e.g., merging strategies) based on the detected version
