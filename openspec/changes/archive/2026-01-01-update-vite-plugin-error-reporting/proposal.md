# Change: Update Vite Plugin Error Reporting

## Why

Currently, error messages in the Vite plugin are inconsistent, sometimes showing `[runtime-env]` and sometimes `[@runtime-env/cli]` (when the error originates from the CLI). This creates confusion for users. Additionally, when an error occurs during development (e.g., an invalid schema or missing environment variable), the error is only shown in the terminal, making it easy for developers to miss. Leveraging Vite's HMR overlay will provide immediate feedback in the browser.

## What Changes

- Use `[@runtime-env/vite-plugin]` as the standard prefix for all error messages and logs originating from the Vite plugin itself.
- Integrate `@runtime-env/vite-plugin` with Vite's HMR overlay in development mode to display **every** reported error directly in the browser. This includes CLI execution errors (e.g., `gen-js`, `gen-ts`, `interpolate`) and plugin-specific validation errors (e.g., missing script tag).
- Display CLI error messages as-is (e.g., maintaining their `[@runtime-env/cli]` prefix) when they are caught and reported by the plugin.
- Ensure the error overlay is cleared (via a full reload) when the error is resolved in dev mode.
- Preview mode will continue to report errors via the terminal logger (as it lacks a built-in HMR overlay).

## Impact

- **Vite Plugin**: Enhanced developer experience with browser-based error feedback and consistent branding in logs.
- **Affected specs**: `vite-plugin`.
