## MODIFIED Requirements

### Requirement: Generate JavaScript (gen-js)

The CLI SHALL provide a `gen-js` command that generates a JavaScript file containing environment variables as a global object.

#### Scenario: Generate runtime-env.js with unescaped characters

- **WHEN** `runtime-env gen-js` is executed with environment variables containing HTML characters (e.g., `FOO="<script>"`)
- **THEN** the output SHALL contain the unescaped characters (e.g., `"FOO": "<script>"`)
- **AND** it SHALL NOT use JS escape sequences like `\\u003C`.

### Requirement: Template Interpolation (interpolate)

The CLI SHALL provide an `interpolate` command that replaces template placeholders in files with environment variable values.

#### Scenario: Interpolate HTML file with unescaped characters

- **WHEN** `runtime-env interpolate` is executed with environment variables containing characters like `<` or `>`
- **THEN** these characters SHALL be interpolated into the output file exactly as they are in the environment variable.
- **AND** they SHALL NOT be escaped into JS escape sequences.
