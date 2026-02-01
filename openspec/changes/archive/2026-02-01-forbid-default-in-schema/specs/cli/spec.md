## MODIFIED Requirements

### Requirement: JSON Schema Validation

The CLI SHALL validate environment variables against a provided JSON Schema.

#### Scenario: Invalid environment variable

- **WHEN** an environment variable does not match the schema type
- **THEN** the CLI SHALL output an error message and exit with a non-zero code.

#### Scenario: Prohibited 'default' keyword in schema

- **WHEN** the CLI loads a `.runtimeenvschema.json` that contains the `default` keyword
- **THEN** the CLI SHALL output an error message stating that `default` is prohibited.
- **AND** it SHALL exit with a non-zero code.
- **AND** it SHALL NOT proceed with generation or interpolation.
