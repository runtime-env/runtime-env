## Context

The `@runtime-env/vite-plugin` runs CLI commands in the background during development. When these commands fail, the errors are logged to the terminal but might be missed by the developer. Vite provides a WebSockets-based HMR overlay that can be used to display errors in the browser.

## Goals

- Standardize error prefix to `[@runtime-env/vite-plugin]` within the Vite plugin.
- Improve developer visibility of errors in Vite development mode.

## Decisions

### Decision: Consistent Plugin Prefix

All log and error messages originating from the Vite plugin itself (currently using `[runtime-env]`) will be updated to use the `[@runtime-env/vite-plugin]` prefix. This provides clear branding for the plugin's native logs.

### Decision: Error De-duplication

To avoid cluttering the terminal, the plugin will implement a simple de-duplication mechanism for error logs. A state variable will store the last reported error message. If a new error occurs with the exact same message as the previous one, it will not be logged to the terminal again.

However, the error will still be sent to the HMR overlay in dev mode to ensure it remains visible in the browser as long as it persists.

When the plugin recovers (succeeds), the "last error" state will be cleared, allowing the same error to be logged again if it recurs later.

### Decision: HMR Overlay Integration

In `packages/vite-plugin/src/dev.ts`, we will use `server.ws.send` to communicate with the client. Note that this is only available in development mode as Vite's `PreviewServer` does not provide a WebSocket interface.

**Every** error reported by the plugin during development mode SHALL be sent to the HMR overlay. This ensures maximum visibility for the developer.

- **On Error (Dev)**: Send a message of type `error`. To ensure consistency, `logError` in `utils.ts` may be updated to optionally accept a `ViteDevServer` or a generic `sendError` callback.
  ```typescript
  server.ws.send({
    type: "error",
    err: {
      message: "[@runtime-env/vite-plugin] " + errorMessage,
      stack: "", // CLI errors don't usually have a JS stack trace we want to show here
    },
  });
  ```
- **On Recovery (Dev)**: Trigger a full reload to clear the overlay:

  ```typescript
  server.ws.send({ type: "full-reload" });
  ```

  While Vite doesn't have a direct "clear error" WS message, a `full-reload` or a successful `update` will effectively clear the overlay as the page refreshes and the plugin (hopefully) succeeds this time. Given that `runtime-env.js` is served via middleware, a full reload is the safest way to ensure the client gets the newly generated configuration.

  To minimize noise, we will completely remove the "runtime-env recovered" log message. After an error is resolved, the clearing of the HMR overlay and the subsequent successful page load (via full-reload) provide sufficient feedback. The plugin SHALL remain silent in the terminal during successful recovery.

- **Preview Mode**: Since `PreviewServer` does not support HMR or overlays natively, we will continue to rely on descriptive `logError` calls using Vite's `Logger`. These will be visible in the terminal where `vite preview` is running.

## Risks / Trade-offs

- **Full Reload on Recovery**: A full reload might be slightly disruptive, but since it only happens when recovering from an error state (which usually prevented the app from working correctly anyway), it is acceptable.
- **Interception Complexity**: Intercepting and transforming strings in stderr adds a small amount of complexity to the plugin, but it's a safer way to achieve consistency without breaking independent CLI usage.
