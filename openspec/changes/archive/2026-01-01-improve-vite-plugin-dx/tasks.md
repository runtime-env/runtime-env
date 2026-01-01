## 1. Implementation

- [x] 1.1 Implement a polite error reporting utility in `utils.ts` that leverages Vite's `Logger` API.
- [x] 1.2 Refactor `runRuntimeEnvCommand` in `utils.ts` to capture CLI exit codes and stderr/stdout.
- [x] 1.3 Update `dev.ts`, `preview.ts`, `build.ts`, and `vitest.ts` to handle CLI errors:
  - In `dev` and `preview`: Log the error politely and keep the server running.
  - In `build` and `test`: Log the error politely and terminate the process.
- [x] 1.4 Implement recovery logic to report a success message when a failing state is resolved.
- [x] 1.5 Implement a polite check for the `runtime-env.js` script tag in `index.html` during transformation/build.
- [x] 1.6 Verify behavior manually across all modes (dev, test, build, preview) by inducing various failures (missing schema, invalid JSON, missing env vars, missing script tag).
- [x] 1.7 Ensure existing tests continue to pass.
