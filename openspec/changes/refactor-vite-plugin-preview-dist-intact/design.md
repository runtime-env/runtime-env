# Design: Refactor Vite Plugin Preview to Keep Dist Intact

## Context

The `@runtime-env/vite-plugin` aims to provide a seamless experience for managing runtime environment variables. In `preview` mode, it needs to generate `runtime-env.js` and interpolate `index.html` with actual environment variables. Currently, it does this by writing to the `dist` directory.

## Goals

- Keep the `dist` directory intact during `vite preview`.
- Serve the generated `runtime-env.js` and interpolated `index.html` dynamically.

## Decisions

- **Middleware Interception**: Use `server.middlewares.use` in `configurePreviewServer` to intercept requests for `index.html` and `runtime-env.js`.
- **In-Memory/Temp Storage**:
  - For `runtime-env.js`: Generate it into a temporary directory (e.g., `node_modules/.runtime-env/preview`) and serve it from there.
  - For `index.html`: Read the original `dist/index.html`, interpolate it using the CLI (via a temp file), and serve the resulting content.
- **Order of Middleware**: Ensure our middleware runs before Vite's default static file serving middleware so we can intercept the requests.

## Risks / Trade-offs

- **Performance**: Interpolating `index.html` on every request might be slow. However, for `preview` mode (typically used locally for verification), this is usually acceptable. We can cache the interpolated content in memory until the server restarts.
- **Base Path**: We must correctly handle the Vite `base` configuration when matching request paths.
