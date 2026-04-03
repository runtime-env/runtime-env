# Recipe: testing runtime values

## Vite + Vitest

Use plugin test mode so `runtime-env.js` is auto-injected.

## Non-Vite tests

Generate a test-specific runtime file with CLI `gen-js` and load it in test setup.
