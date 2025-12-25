# Change: Remove Automatic Script Injection from Vite Dev and Build Plugins

## Why

The current `devPlugin` and `buildPlugin` in the Vite plugin automatically inject a `<script src="/runtime-env.js"></script>` tag into `index.html` during development and build processes, respectively. This automatic injection can cause issues when the `index.html` structure differs from the plugin's assumption or when users prefer to manage script inclusion manually. Furthermore, for advanced build setups and complex application architectures, users require explicit control over how scripts are loaded to integrate effectively with their application's loading mechanisms.

## What Changes

- The `devPlugin` will no longer automatically inject the `<script src="/runtime-env.js"></script>` tag into `index.html`.
- The `buildPlugin` will no longer automatically inject the `<script src="/runtime-env.js"></script>` tag into `index.html`.

## Impact

- **Affected spec**: `vite-plugin`
- **Affected code**: `packages/vite-plugin/src/dev.ts`, `packages/vite-plugin/src/build.ts`
