## MODIFIED Requirements

### Requirement: Template Interpolation (interpolate)

The CLI SHALL provide an `interpolate` command that replaces template placeholders in files with environment variable values.

#### Scenario: Interpolate HTML file with unescaped characters

- **WHEN** `runtime-env interpolate` is executed with environment variables containing characters like `<` or `>`
- **THEN** these characters SHALL be interpolated into the output file exactly as they are in the environment variable.
- **AND** they SHALL NOT be escaped into JS escape sequences.

#### Scenario: Interpolate input from stdin

- **WHEN** `runtime-env interpolate` is executed without `--input-file` and without a positional input
- **THEN** it SHALL read the template from stdin.
