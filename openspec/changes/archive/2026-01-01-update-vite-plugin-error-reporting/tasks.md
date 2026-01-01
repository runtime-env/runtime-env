## 1. Vite Plugin Changes

- [x] 1.1 Update `packages/vite-plugin/src/utils.ts`'s `logError` to use `[@runtime-env/vite-plugin]` prefix and implement error de-duplication.
- [x] 1.2 Update `logError` to optionally accept a `server` (or WebSocket) to send errors to the HMR overlay.
- [x] 1.3 Update `packages/vite-plugin/src/dev.ts` to use the updated `logError` for ALL error cases (gen-js, gen-ts, interpolate, missing script tag).
- [x] 1.4 Ensure the error message sent to the overlay uses the `[@runtime-env/vite-plugin]` prefix.
- [x] 1.5 Remove `logInfo` utility from `utils.ts` (or stop using it for "recovered" messages) as per spec.
- [x] 1.6 Implement triggering a full reload when the plugin recovers from an error in dev mode.
- [x] 1.7 Update `build.ts`, `preview.ts`, and `vitest.ts` to use the new prefix (via `logError`).
- [x] 1.8 Verify with manual tests that:
  - [x] Overlay appears in Dev mode for CLI errors.
  - [x] Overlay appears in Dev mode for missing script tag.
  - [x] Overlay appears in Dev mode for interpolation errors.
  - [x] Overlay disappears on resolution in Dev mode.
  - [x] Terminal logs are correct in all modes.

## 2. Validation

- [x] 2.1 Run `npm run build` in root to ensure everything builds.
- [x] 2.2 Run `openspec validate update-vite-plugin-error-reporting --strict`.
