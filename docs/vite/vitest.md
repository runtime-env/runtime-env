# Vite + Vitest

In test mode, the plugin generates a runtime payload and injects it into Vitest setup.

## What you get

- Schema validation before tests.
- `runtime-env.js` generation for runtime access in tests.
- Auto setup-file injection.

If tests fail due to env/schema mismatch, validate `.runtimeenvschema.json` and test env values first.
