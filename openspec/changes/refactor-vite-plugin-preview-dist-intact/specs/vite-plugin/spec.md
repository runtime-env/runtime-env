## MODIFIED Requirements

### Requirement: Seamless Vite Workflow Integration

The `@runtime-env/vite-plugin` plugin SHALL provide a seamless, zero-script-boilerplate experience for Vite projects across all development, testing, and production stages, running commands only when they are configured via a nested object or automatically detected.

#### Scenario: Vite development mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts` with `{'gen-js': {...}, 'interpolateIndexHtml': {...}}`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite` (or `npm run dev`).
- **THEN** the plugin automatically runs the configured commands (`gen-js`, `interpolateIndexHtml`) and the automatically detected `gen-ts` command in watch mode.
- **AND** if the `gen-js` object is present, the Vite dev server serves `/runtime-env.js` (or `${base}/runtime-env.js` if `base` is configured) via middleware, without writing it to the `public/` directory.
- **AND** the `runtime-env.js` file SHALL remain available even if `interpolateIndexHtml` is also configured.
- **AND** if the `interpolateIndexHtml` object is present, the Vite dev server serves the correctly interpolated `index.html` in memory.
- **AND** changes to `.env` or the schema file trigger automatic regeneration and HMR.
- **AND** the `package.json` `dev` script is simply `"dev": "vite"`.

#### Scenario: Vite build mode

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured in `vite.config.ts`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vite build` (or `npm run build`).
- **THEN** the plugin automatically runs `gen-ts`.
- **AND** the plugin SHALL NOT run `gen-js` or `interpolateIndexHtml`, preserving the "build once, deploy anywhere" principle.
- **AND** the `package.json` `build` script is `"build": "tsc && vite build"`.

#### Scenario: Vite preview mode

- **GIVEN** a Vite project has been built using `vite build`.
- **AND** the `@runtime-env/vite-plugin` plugin is configured with `{'gen-js': {...}, 'interpolateIndexHtml': {...}}`.
- **WHEN** the user runs `vite preview` (or `npm run preview`).
- **THEN** the plugin hooks into the preview server to perform runtime generation for the configured commands.
- **AND** the plugin SHALL serve `runtime-env.js` and the interpolated `index.html` via middleware, without modifying the `dist` directory.
- **AND** the `package.json` `preview` script is simply `"preview": "vite preview"`.

#### Scenario: Vite test mode (Vitest)

- **GIVEN** the `@runtime-env/vite-plugin` plugin is configured with `{'gen-js': {...}}`.
- **AND** a `tsconfig.json` file exists in the project root.
- **WHEN** the user runs `vitest`.
- **THEN** the plugin SHALL automatically run `gen-ts` for type checking in the test environment.
- **AND** it SHALL automatically generate `runtime-env.js` in a temporary directory and append it to `config.test.setupFiles`.
- **AND** it SHALL NOT interfere with the test runner's execution.

### Requirement: Clean Project Root

The `@runtime-env/vite-plugin` SHALL maintain a clean project root by using temporary directories for all internal artifacts.

#### Scenario: No visible artifacts in project root

- **GIVEN** the `@runtime-env/vite-plugin` is active in any mode.
- **WHEN** the plugin needs to generate temporary files (e.g., for HTML interpolation, backups, or serving via middleware).
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output file `src/runtime-env.d.ts` if a `tsconfig.json` is present.
- **AND** `dist/runtime-env.js` and `dist/index.html.backup` SHALL NOT be created in the `dist` directory.
- **AND** all other temporary artifacts SHALL be stored within `node_modules/.runtime-env` to keep the project root clean.
