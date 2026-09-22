## 1. Implementation

- [x] 1.1 CLI: `interpolate` reads stdin when neither `--input-file` nor a positional input is given, with a test and docs.
- [x] 1.2 Plugin: `runRuntimeEnvCommand` passes `input` through stdin and returns stdout; remove `createTempDir` and `signal-exit`.
- [x] 1.3 Dev: keep `gen-js` stdout in memory for the middleware and return `interpolate` stdout from `transformIndexHtml`.
- [x] 1.4 Preview: keep `gen-js` and `interpolate` stdout in memory.
- [x] 1.5 Vitest: add `virtual:runtime-env.js` to `setupFiles` and serve the `gen-js` stdout through `resolveId`/`load`.

## 2. Verification

- [x] 2.1 Run package tests, comprehensive-vite (dev, test, preview, docker), and `tests/`.
