## MODIFIED Requirements

### Requirement: Simplified Vite Integration with a Native Plugin

A new Vite-native plugin, `@runtime-env/vite-plugin`, SHALL be provided to simplify the integration of `runtime-env` with Vite projects.

#### Scenario: Plugin is zero-config

- **GIVEN** a user has installed `@runtime-env/vite-plugin`.
- **WHEN** they configure the plugin in their `vite.config.ts` using `runtimeEnv()`.
- **THEN** it SHALL automatically enable `gen-js` and `interpolateIndexHtml` features.
- **AND** it SHALL automatically detect and use Vite's standard environment files (`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`) based on the current Vite mode and `envDir`.
- **AND** it SHALL use default values for `schemaFile` (`.runtimeenvschema.json`) and `globalVariableName` (`runtimeEnv`).
- **AND** the `gen-ts` sub-command SHALL be automatically executed if a `tsconfig.json` file is found in the project root, with a fixed output file `src/runtime-env.d.ts`.
- **AND** the `runtimeEnv` function SHALL NOT accept any arguments.

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
- **AND** it SHALL automatically detect env files suitable for the preview environment.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using detected env files) in a temporary directory and append it to `config.test.setupFiles`.
- **AND** it SHALL NOT interfere with the test runner's execution.
