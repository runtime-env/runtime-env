## 1. Scaffolding

- [ ] 1.1. Create a new package directory `packages/vite-plugin`.
- [ ] 1.2. Initialize `package.json` for `@runtime-env/vite-plugin`, including dependencies like `@runtime-env/cli`, and `chokidar`.
- [ ] 1.3. Set up TypeScript configuration (`tsconfig.json`) for the new package.
- [ ] 1.4. Create the main plugin file `src/index.ts`.

## 2. Vite Plugin Implementation

- [ ] 2.1. Implement the core plugin logic as a native Vite plugin, following the guide at `https://vitejs.dev/guide/api-plugin.html`.
- [ ] 2.2. Define plugin options with a nested structure, where top-level keys (`gen-ts`, `gen-js`, `interpolate`) enable the corresponding sub-commands.
- [ ] 2.3. Implement Vite-specific hooks with conditional logic.
  - [ ] 2.3.1. Add logic to check for user-provided configuration before running any `runtime-env` command.
  - [ ] 2.3.2. Handle `dev` mode: Use `configureServer` hook to conditionally run `gen-ts`, `gen-js`, `interpolate` in watch mode.
  - [ ] 2.3.3. Implement `transformIndexHtml` to conditionally serve the interpolated HTML in memory.
  - [ ] 2.3.4. Handle `build` mode: Use `buildStart` hook to conditionally run `gen-ts`.
  - [ ] 2.3.5. Handle `preview` mode: Use `configurePreviewServer` to conditionally inject environment variables and `index.html` content at runtime.
- [ ] 2.4. Implement test mode support, ensuring it also respects conditional execution.

## 3. Testing

- [ ] 3.1. Add unit tests for the plugin's core logic.
- [ ] 3.2. Add an E2E test to verify all modes (dev, build, preview) for the Vite plugin.

## 4. Example Refactoring

- [ ] 4.1. Refactor `examples/comprehensive-vite`.
  - [ ] 4.1.1. Add `@runtime-env/vite-plugin` to its `devDependencies`.
  - [ ] 4.1.2. Update `vite.config.ts` to use the new plugin.
  - [ ] 4.1.3. Drastically simplify `package.json` scripts for `dev`, `build`, `preview`, and `test`.
  - [ ] 4.1.4. Update `vitest.config.ts` to use the new test setup if applicable.

## 5. Documentation

- [ ] 5.1. Write a comprehensive `README.md` for the `@runtime-env/vite-plugin` package.
- [ ] 5.2. Add usage examples for Vite.
- [ ] 5.3. Document all available plugin options.
- [ ] 5.4. Update the root `README.md` and any other relevant documentation to mention the new package.
