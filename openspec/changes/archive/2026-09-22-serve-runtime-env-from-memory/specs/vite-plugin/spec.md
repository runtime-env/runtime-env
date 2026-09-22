## MODIFIED Requirements

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands automatically with sensible defaults, while respecting Vite's `envDir` for environment file resolution.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs `gen-js`, `interpolateIndexHtml`, and the automatically detected `gen-ts` command in watch mode.
- **AND** the plugin SHALL resolve `.env` files from the directory specified in Vite's `envDir` (defaulting to the project root).
- **AND** the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to detected `.env` files or the schema file trigger automatic regeneration and HMR.
- **AND** `gen-ts` SHALL be executed independently of `gen-js` results, ensuring types are always synchronized with the schema.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is active.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` (using environment files detected from `envDir`) in memory and append the virtual module `virtual:runtime-env.js`, which serves it, to `config.test.setupFiles`.
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
- **THEN** the plugin SHALL run `gen-js` and `interpolateIndexHtml` once when the preview server starts.
- **AND** the plugin SHALL serve the generated results for the lifetime of the preview server, without regenerating them per request.
- **AND** changes to `.env` files or the schema file SHALL take effect only after the preview server restarts.
- **AND** the plugin SHALL serve `runtime-env.js` and the interpolated `index.html` via middleware, without modifying the `dist` directory.
- **AND** it SHALL automatically detect environment files from `envDir` suitable for the preview environment.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

### Requirement: Clean Project Root

The `@runtime-env/vite-plugin` SHALL maintain a clean project root by keeping all internal artifacts in memory.

#### Scenario: No visible artifacts in project root

- **GIVEN** the `@runtime-env/vite-plugin` is active in any mode.
- **WHEN** the plugin generates `runtime-env.js` or interpolates `index.html`.
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output file `runtime-env.d.ts` if a `tsconfig.json` is present.

#### Scenario: No temp files

- **GIVEN** a dev server, preview server, or Vitest run.
- **WHEN** the plugin runs `gen-js` or `interpolate`.
- **THEN** it SHALL pass input through stdin and read the result from stdout.
- **AND** it SHALL NOT write any file other than `runtime-env.d.ts`, so no file is left behind when the process is interrupted or killed.
