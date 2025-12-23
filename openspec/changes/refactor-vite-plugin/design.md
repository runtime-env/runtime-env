## 1. Current State

The current `@runtime-env/vite-plugin` implementation resides entirely in `packages/vite-plugin/src/index.ts`. It uses a series of `isServe`, `isBuild`, `isTest`, and `isPreview` flags to conditionally execute logic within the plugin hooks. This approach makes the code difficult to follow and maintain.

## 2. Proposed Refactoring

Inspired by the official Vite plugin authoring guide, we will refactor the plugin to separate logic for each mode into its own file. This will improve modularity and make the codebase easier to reason about.

### 2.1. New File Structure

```
packages/vite-plugin/src/
├── index.ts          # Main plugin entry point
├── dev.ts            # Logic for 'serve' command
├── build.ts          # Logic for 'build' command
├── preview.ts        # Logic for 'preview' command
├── vitest.ts         # Logic for 'vitest' mode
├── types.ts          # Shared types and schemas
└── utils.ts          # Shared utility functions (e.g., for spawning runtime-env)
```

### 2.2. Logic Separation

- **`dev.ts`**: Will contain the logic currently executed when `isServe` is true (e.g., `configResolved` and `configureServer` hooks for development).
- **`build.ts`**: Will contain the logic for the `build` command (e.g., `config` and `configResolved` hooks for builds).
- **`preview.ts`**: Will contain the logic for the `preview` command (e.g., `config` hook for preview).
- **`vitest.ts`**: Will contain the logic for `vitest` mode (e.g., `config` hook for tests).
- **`utils.ts`**: Will contain shared functions, such as the `spawnSync` calls to `@runtime-env/cli`, to avoid code duplication.
- **`index.ts`**: The main plugin function will determine the current mode and return the appropriate set of plugin hooks by composing them from the mode-specific modules. The `transformIndexHtml` hook, which is used across multiple modes, might be defined here or in `utils.ts`.

This structure will ensure a clean separation of concerns and align the plugin with Vite's best practices.
