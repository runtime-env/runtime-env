## Context

The `@runtime-env/vite-plugin` is designed to be highly opinionated and provide the best possible developer experience with zero configuration. By removing all options, we eliminate cognitive load and ensure that all projects follow the same consistent patterns.

## Goals

- **Zero Options**: The plugin is used as `runtimeEnv()` with no arguments.
- **Auto-Detection**: Everything is inferred from the project structure and Vite's own configuration.
- **Simplicity**: No complex configuration objects to manage.

## Decisions

### 1. Removing the Options Argument

The `runtimeEnv` function will be changed from `runtimeEnv(options: Options)` to `runtimeEnv()`. This enforces the zero-config philosophy.

### 2. Eliminating Feature Toggles

Features like `genJs` and `interpolateIndexHtml` will always be active from the plugin's perspective.

- If a user doesn't want the generated JS, they simply don't include the script tag in their HTML.
- If a user doesn't want interpolation, they don't use the template syntax in their HTML.
  This keeps the plugin logic simple and predictable.

### 3. Fixed Conventions

The plugin will use fixed conventions that align with the `runtime-env` defaults:

- Schema: `.runtimeenvschema.json`
- Global Variable: `runtimeEnv`
- Type Definitions: `src/runtime-env.d.ts`

### 4. Robust Env File Detection

The plugin will replicate Vite's env file loading logic to find the correct file _paths_:

- `.env`
- `.env.local`
- `.env.[mode]`
- `.env.[mode].local`

These paths will be passed directly to the `@runtime-env/cli` via the `--env-file` argument. The plugin SHALL NOT use Vite's `loadEnv` utility or rely on its parsed results, as `@runtime-env/cli` provides its own parsing logic (including support for JSON-serialized values) which must remain the single source of truth for `runtime-env` artifacts.

## Risks / Trade-offs

- **Lack of Customization**: Users who need a different schema file name or global variable name will not be able to use the Vite plugin and must fall back to the CLI. This is an intentional trade-off to keep the plugin simple and opinionated.
- **Breaking Change**: This is a major breaking change for existing users of the plugin, but it significantly simplifies the setup for all new and existing standard projects.
