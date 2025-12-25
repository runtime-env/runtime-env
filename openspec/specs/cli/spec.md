# CLI Specification

## Purpose

The `runtime-env` CLI provides tools to generate runtime environment variable configurations and interpolate them into HTML templates. It enables the "build once, deploy anywhere" principle by deferring environment variable injection until runtime.

## Requirements

### Requirement: Generate JavaScript (gen-js)

The CLI SHALL provide a `gen-js` command that generates a JavaScript file containing environment variables as a global object.

#### Scenario: Generate runtime-env.js with unescaped characters

- **WHEN** `runtime-env gen-js` is executed with environment variables containing HTML characters (e.g., `FOO="<script>"`)
- **THEN** the output SHALL contain the unescaped characters (e.g., `"FOO": "<script>"`)
- **AND** it SHALL NOT use JS escape sequences like `\\u003C`.

### Requirement: Generate TypeScript (gen-ts)

The CLI SHALL provide a `gen-ts` command that generates TypeScript type definitions from a JSON Schema.

#### Scenario: Generate runtime-env.d.ts from schema

- **WHEN** `runtime-env gen-ts --schema-file .runtimeenvschema.json` is executed
- **THEN** it generates a `.d.ts` file with type definitions matching the schema.

### Requirement: Template Interpolation (interpolate)

The CLI SHALL provide an `interpolate` command that replaces template placeholders in files with environment variable values.

#### Scenario: Interpolate HTML file with unescaped characters

- **WHEN** `runtime-env interpolate` is executed with environment variables containing characters like `<` or `>`
- **THEN** these characters SHALL be interpolated into the output file exactly as they are in the environment variable.
- **AND** they SHALL NOT be escaped into JS escape sequences.

### Requirement: JSON Schema Validation

The CLI SHALL validate environment variables against a provided JSON Schema.

#### Scenario: Invalid environment variable

- **WHEN** an environment variable does not match the schema type
- **THEN** the CLI SHALL output an error message and exit with a non-zero code.
