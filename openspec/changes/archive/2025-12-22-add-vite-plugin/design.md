## Design Decisions for `@runtime-env/vite-plugin`

This document outlines the technical approach for implementing the new `@runtime-env/vite-plugin` package.

### Core Principle: Adherence to Vite Plugin Best Practices

The implementation of this plugin will strictly follow the recommendations and patterns for creating native Vite plugins, as described in the official Vite documentation, available at [https://vitejs.dev/guide/api-plugin.html](https://vitejs.dev/guide/api-plugin.html). This ensures the resulting package is robust, maintainable, and idiomatic within the Vite ecosystem.

### Key Implementation Details

1.  **Plugin Options Design**: The plugin will accept a single configuration object. The top-level keys of this object will correspond to the `runtime-env` sub-commands: `gen-ts`, `gen-js`, and `interpolateIndexHtml`. The presence of a key (e.g., `'gen-ts': {}`) enables the command. The value for each key will be an object containing the specific options for that command, mirroring the CLI arguments.

    ```typescript
    // Example vite.config.ts
    import runtimeEnv from "@runtime-env/vite-plugin";

    export default {
      plugins: [
        runtimeEnv({
          schema: ".runtimeenvschema.json", // Common option
          "gen-ts": {
            outputFile: "src/runtime-env.d.ts",
          },
          "gen-js": {
            envFile: [".env"], // Command-specific option
            outputFile: "public/runtime-env.js",
          },
          interpolateIndexHtml: {
            envFile: [".env"], // Command-specific option
            inputFile: "index.html",
          },
        }),
      ],
    };
    ```

2.  **Hook-based and Conditional Logic**: All functionality will be implemented within the appropriate Vite hooks. The execution of commands will be conditional on the presence of the corresponding nested configuration object.
    - **`configureServer`**: In dev mode, this hook will check for the presence of `gen-ts`, `gen-js`, or `interpolateIndexHtml` keys in the config. For each one present, it will perform the initial command execution and set up file watchers.
    - **`transformIndexHtml`**: This hook will only apply its transformation logic if the `interpolateIndexHtml` key exists in the config.
    - **`buildStart`**: This hook will run the `runtime-env gen-ts` command _only if_ the `gen-ts` key is present in the config.
    - **`configurePreviewServer`**: This hook will check for `gen-js` and `interpolateIndexHtml` keys and perform runtime generation accordingly.

3.  **File Watching**: The plugin will use Vite's built-in watcher via the `configureServer` hook (`server.watcher`). This is the idiomatic way to watch files in a Vite plugin and trigger server updates.

By adhering to these principles from the official Vite documentation, we will produce a high-quality, canonical Vite plugin that is easy for end-users to adopt and for future contributors to maintain.
