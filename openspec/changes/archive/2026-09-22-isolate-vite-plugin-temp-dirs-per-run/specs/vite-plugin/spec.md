## MODIFIED Requirements

### Requirement: Clean Project Root

The `@runtime-env/vite-plugin` SHALL maintain a clean project root by using temporary directories for all internal artifacts.

#### Scenario: No visible artifacts in project root

- **GIVEN** the `@runtime-env/vite-plugin` is active in any mode.
- **WHEN** the plugin needs to generate temporary files (e.g., for HTML interpolation, backups, or serving via middleware).
- **THEN** it SHALL NOT create any visible files or directories in the project root, except for the intentional output file `runtime-env.d.ts` if a `tsconfig.json` is present.
- **AND** `dist/runtime-env.js` and `dist/index.html.backup` are ALLOWED in the `dist` directory as they are used for preview mode.
- **AND** all other temporary artifacts SHALL be stored within `node_modules/.runtime-env` to keep the project root clean.

#### Scenario: Temp directory isolated per run

- **GIVEN** multiple dev servers, preview servers, and/or Vitest runs are started from the same working directory.
- **WHEN** each run generates temporary files.
- **THEN** each run SHALL create its own uniquely named directory `node_modules/.runtime-env/<random>/`.
- **AND** it SHALL write the generated `runtime-env.js` to `<random>/runtime-env.js`.
- **AND** dev and preview servers SHALL write the interpolated HTML to `<random>/index.html`.
- **AND** a run SHALL NOT read, write, or delete another run's directory.
- **AND** the directory SHALL persist for the lifetime of the run, with files overwritten in place instead of the directory being deleted after each transform or request.

#### Scenario: Temp directories removed properly

- **GIVEN** a dev server, preview server, or Vitest run has created a temp directory.
- **WHEN** the process exits, including on `SIGINT`, `SIGHUP`, or `SIGTERM`.
- **THEN** the plugin SHALL remove the directory.
- **AND** a dev server SHALL also remove its directory in the `closeBundle` hook when it closes, including when Vite restarts it (e.g., after an `.env` change).
