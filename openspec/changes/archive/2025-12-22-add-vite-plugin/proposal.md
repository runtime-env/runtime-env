# Change: Add Vite plugin for simplified integration

## Why

Setting up `@runtime-env/cli` with Vite requires significant boilerplate in `package.json` scripts to handle different stages (dev, build, preview, test). This creates a steep learning curve and makes the setup verbose. A new Vite-native plugin will abstract this complexity away.

## What Changes

- **New Package**: Introduce a new, Vite-specific package named `@runtime-env/vite-plugin` to follow Vite's recommendation.
- **Simplified Configuration**: This plugin will allow users to configure `runtime-env` directly within their `vite.config.ts` using a nested object structure. The presence of a key for a sub-command (e.g., `'gen-ts': {}`) will enable that command.
- **Configuration-Driven Workflows**: The plugin will automatically run the necessary `runtime-env` commands (`gen-ts`, `gen-js`, `interpolate`) only when they are explicitly configured by the user. This allows users to opt-in to features rather than having them run by default.
- **Example Refactoring**: The `examples/comprehensive-vite` will be refactored to use this new plugin, resulting in much simpler and cleaner `package.json` scripts, similar to a default `npm create vite` project.

## Impact

- **Affected Specs**: A new capability `vite-plugin` will be created.
- **Affected Code**:
  - A new package `packages/vite-plugin` will be created.
  - `examples/comprehensive-vite` will be refactored.
  - `examples/comprehensive-webpack` will NOT be affected.
  - CI workflows for the examples will not be affected.
