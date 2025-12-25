## Context

The Vite plugin fails to serve `runtime-env.js` in development mode when HTML interpolation is enabled or when a non-root `base` path is used.

## Decisions

- **Separate Temp Directories**: Use `getTempDir("dev-interpolate")` for `transformIndexHtml` to ensure its cleanup doesn't affect `getTempDir("dev")` used for `gen-js`.
- **Robust Middleware Path Matching**:
  - Retrieve `base` from `server.config.base`.
  - Ensure `base` starts and ends with `/`.
  - Match `req.url` against `base + "runtime-env.js"`, handling potential query parameters by using `URL` parsing or simple string prefix matching.

## Risks / Trade-offs

- Minimal risk as these are standard Vite plugin patterns.
- Using `node_modules/.runtime-env` is already an established pattern in this project.
