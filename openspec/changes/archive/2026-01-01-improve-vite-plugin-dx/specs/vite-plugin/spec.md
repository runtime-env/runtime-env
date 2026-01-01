## MODIFIED Requirements

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands automatically with sensible defaults.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs `gen-js`, `interpolateIndexHtml`, and the automatically detected `gen-ts` command in watch mode.
- **AND** the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to detected `.env` files or the schema file trigger automatic regeneration and HMR.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using detected env files) in a temporary directory and append it to `config.test.setupFiles`.
- **AND** it SHALL NOT interfere with the test runner's execution.

#### Scenario: Vite build mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite build` (or `npm run build`).
- **THEN** the plugin automatically runs `gen-ts`.
- **AND** the plugin SHALL NOT run `gen-js` or `interpolateIndexHtml` during the build command, preserving the "build once, deploy anywhere" principle.

#### Scenario: Vite preview mode

- **GIVEN** a Vite project has been built using `vite build`.
- **AND** the `@runtime-env/vite-plugin` plugin is active.
- **WHEN** the user runs `vite preview` (or `npm run preview`).
- **THEN** the plugin hooks into the preview server to perform runtime generation for `gen-js` and `interpolateIndexHtml`.
- **AND** the plugin SHALL serve `runtime-env.js` and the interpolated `index.html` via middleware, without modifying the `dist` directory.
- **AND** it SHALL automatically detect env files suitable for the preview environment.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

## ADDED Requirements

### Requirement: Informative and Resilient Integration

The plugin SHALL provide polite, native Vite feedback for all integration issues and remain resilient in server modes.

#### Scenario: CLI execution failure in dev or preview

- **GIVEN** the plugin is running in `dev` or `preview` mode.
- **WHEN** a `runtime-env` CLI command (e.g., `gen-js`, `gen-ts`) fails or the schema is missing/invalid.
- **THEN** the plugin SHALL report a polite and descriptive error message using Vite's built-in `Logger`.
- **AND** the server SHALL NOT terminate, allowing the user to correct the issue.

#### Scenario: Recovery to success state

- **GIVEN** the plugin was previously reporting an error.
- **WHEN** the underlying issue is resolved (e.g., user fixes schema or adds missing env var).
- **THEN** the plugin SHALL report a polite success message using Vite's built-in `Logger`.
- **AND** the plugin SHALL resume normal operation.

#### Scenario: CLI execution failure in build or test

- **GIVEN** the plugin is running in `build` or `test` mode.
- **WHEN** a `runtime-env` CLI command fails or configuration is missing/invalid.
- **THEN** the plugin SHALL report the error politely using Vite's built-in mechanisms.
- **AND** the build or test process SHALL fail.

#### Scenario: Missing runtime-env.js script tag in HTML

- **GIVEN** the plugin is active.
- **AND** the `index.html` file does NOT contain the required `<script src="/runtime-env.js"></script>` tag.
- **WHEN** the plugin processes the HTML.
- **THEN** it SHALL report a polite warning using Vite's built-in `Logger` and suggest adding the tag.
