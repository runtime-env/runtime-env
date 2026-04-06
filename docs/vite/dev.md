# Vite dev

In `vite dev`, the plugin handles runtime config and guardrails for local development.

## What it does in dev

- validates schema before serving values,
- serves `runtime-env.js` dynamically,
- interpolates HTML during dev requests,
- watches env/schema files and reacts to changes,
- triggers reload/overlay behavior when configuration issues occur,
- generates `src/runtime-env.d.ts` when a TypeScript project is detected.

## Required script tag

`index.html` must include the runtime script before the app entry script.

Use a base-aware absolute path:

- default base: `<script src="/runtime-env.js"></script>`
- non-root base example: `<script src="/my-app/runtime-env.js"></script>`
