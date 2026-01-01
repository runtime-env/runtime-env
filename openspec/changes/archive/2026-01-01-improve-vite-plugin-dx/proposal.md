# Change: Improve Vite Plugin Developer Experience

## Why

The `vite-plugin` should provide clear, polite, and actionable feedback when issues occur (e.g., missing schema, malformed JSON, or validation errors during CLI execution). Currently, some failures are silent or terminate the process abruptly, which hinders productivity.

## What Changes

- **General CLI Error Handling**: Whenever the plugin executes a `runtime-env` CLI command and encounters an error, it will capture the error and report it politely using Vite's built-in logging mechanism.
- **Server Resilience**: CLI execution errors in `dev` and `preview` modes SHALL NOT terminate the server. The server will remain running to allow the user to fix the reported issue.
- **Strict Builds/Tests**: Errors in `build` and `test` modes SHALL still cause the process to fail to prevent invalid artifacts or false test results.
- **HTML Validation**: The plugin will check for the presence of the `<script src="/runtime-env.js"></script>` tag in `index.html` and report its absence politely.
- **Recovery Notification**: When a previously failing state (CLI error or missing configuration) is resolved, the plugin will politely inform the user of the recovery.
- **Vite Integration**: All messages will use Vite's `Logger` API to ensure a native and consistent experience.

## Impact

- **Affected specs**: `vite-plugin`
- **Affected code**: `packages/vite-plugin/src/` (specifically `utils.ts`, `dev.ts`, `build.ts`, `preview.ts`, and `vitest.ts`)
