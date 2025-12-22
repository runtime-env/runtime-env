## 1. Scaffolding

- [x] 1.1. Create a new package directory `packages/vite-plugin`.
- [x] 1.2. Initialize `package.json` for `@runtime-env/vite-plugin`, including dependencies like `@runtime-env/cli`.
- [x] 1.3. Set up TypeScript configuration (`tsconfig.json`) for the new package.
- [x] 1.4. Create the main plugin file `src/index.ts`.

## 2. Vite Plugin Implementation

- [x] 2.1. Implement the core plugin logic as a native Vite plugin, following the guide at `https://vitejs.dev/guide/api-plugin.html`.
- [x] 2.2. Define plugin options with a nested structure, where top-level keys (`gen-ts`, `gen-js`, `interpolateIndexHtml`) enable the corresponding sub-commands.
- [x] 2.3. Implement Vite-specific hooks with conditional logic.
  - [x] 2.3.1. Add logic to check for user-provided configuration before running any `runtime-env` command.
  - [x] 2.3.2. Handle `dev` mode: Use `configureServer` hook to conditionally run `gen-ts`, `gen-js`, `interpolateIndexHtml` in watch mode.
  - [x] 2.3.3. Implement `transformIndexHtml` to conditionally serve the interpolated HTML in memory.
  - [x] 2.3.4. Handle `build` mode: Use `buildStart` hook to conditionally run `gen-ts`.
  - [x] 2.3.5. Handle `preview` mode: Use `configurePreviewServer` to conditionally inject environment variables and `index.html` content at runtime.
- [x] 2.4. Implement test mode support, ensuring it also respects conditional execution.

## 3. Testing

- [x] 3.1. Add unit tests for the plugin's core logic.
- [x] 3.2. Add an E2E test to verify all modes (dev, build, preview) for the Vite plugin.

## 4. Example Refactoring

- [x] 4.1. Refactor `examples/comprehensive-vite`.
  - [x] 4.1.1. Add `@runtime-env/vite-plugin` to its `devDependencies`.
  - [x] 4.1.2. Update `vite.config.ts` to use the new plugin.
  - [x] 4.1.3. Drastically simplify `package.json` scripts for `dev`, `build`, `preview`, and `test`.
  - [x] 4.1.4. Update `vitest.config.ts` to use the new test setup if applicable.

## 5. Documentation

- [x] 5.1. Write a comprehensive `README.md` for the `@runtime-env/vite-plugin` package.
- [x] 5.2. Add usage examples for Vite.
- [x] 5.3. Document all available plugin options.
- [x] 5.4. Update the root `README.md` and any other relevant documentation to mention the new package.
