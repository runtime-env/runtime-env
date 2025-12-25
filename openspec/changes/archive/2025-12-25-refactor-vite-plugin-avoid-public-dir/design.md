## Context

The `@runtime-env/vite-plugin` currently pollutes the `public/` directory during development and requires manual Vitest configuration. This refactoring aims to improve DX by serving files virtually and automating test setup.

## Goals

- Zero pollution of the `public/` directory during development.
- Zero manual configuration for Vitest `setupFiles`.
- Maintain "build once, deploy anywhere" principle.

## Decisions

### Decision: Virtual serving of `runtime-env.js` in Dev Mode

Instead of writing to `public/runtime-env.js`, the plugin will use `configureServer` middleware to intercept requests to `/runtime-env.js`.

- The file will be generated to `node_modules/.runtime-env/dev/runtime-env.js`.
- The middleware will read this file and serve it with the correct `application/javascript` MIME type.
- This ensures that changes to `.env` or schema still trigger regeneration, and the middleware will serve the latest version.

### Decision: Automatic Vitest `setupFiles` Injection

The plugin will use the `config` hook to detect when it's running in `test` mode.

- It will generate `runtime-env.js` to `node_modules/.runtime-env/vitest/runtime-env.js`.
- it will then modify the `config.test.setupFiles` array to include the absolute path to this generated file.
- This works because Vitest merges the Vite config and respects `test.setupFiles`.

## Risks / Trade-offs

- **Risk**: Some users might have custom Vite configurations that conflict with the middleware path `/runtime-env.js`.
- **Mitigation**: This path is standard for `runtime-env` and is what we recommend in `index.html`. If they use a different path, they would have had to configure it anyway.
- **Trade-off**: `runtime-env.js` is no longer a physical file in `public/`. If a user was using it for something other than the `<script>` tag in `index.html` (e.g. some other tool that scans the `public` dir), it might break. However, this is considered an edge case for this project's scope.
