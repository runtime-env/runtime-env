# Change: Update log severity for missing script tag in dev mode

## Why

Currently, when the mandatory `<script src="/runtime-env.js"></script>` tag is missing from `index.html` in development mode, the plugin only logs an "info" message. Since the plugin cannot function without this tag (it provides the runtime environment variables), this should be treated as an error to ensure developers notice it immediately and fix it.

## What Changes

- Change the log severity from `info` to `error` when the `runtime-env.js` script tag is missing in Vite development mode.
- Update the `vite-plugin` specification to reflect this change in severity.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/dev.ts`
