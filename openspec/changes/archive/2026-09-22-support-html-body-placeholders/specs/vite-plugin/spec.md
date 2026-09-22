## ADDED Requirements

### Requirement: Placeholders Anywhere in HTML

The `@runtime-env/vite-plugin` SHALL support template placeholders anywhere in `index.html`, including body text, without Vite's HTML parser failing or warning.

#### Scenario: Placeholder in body text during dev

- **GIVEN** `index.html` contains a placeholder in body text (e.g., `<div><%= runtimeEnv.VITE_FOO %></div>`).
- **WHEN** the dev server serves `index.html`.
- **THEN** it SHALL serve the interpolated value.

#### Scenario: Placeholder in body text during build

- **GIVEN** `index.html` contains a placeholder in body text.
- **WHEN** `vite build` runs.
- **THEN** the build SHALL succeed.
- **AND** `dist/index.html` SHALL contain the placeholder unchanged.

#### Scenario: Placeholder in body text during preview

- **GIVEN** a build whose `dist/index.html` contains a placeholder in body text.
- **WHEN** the preview server serves `index.html`.
- **THEN** it SHALL serve the interpolated value.
