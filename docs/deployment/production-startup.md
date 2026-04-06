# Production startup

After `vite build` (or any frontend build), real production runtime work happens during deployment/startup.

Vite is no longer in control in real production.

Typical runtime environments include nginx, caddy, containers, and static hosting platforms.

Use the CLI for startup/deploy-time generation.

## Generate runtime-env.js

Use `gen-js` when browser JavaScript needs runtime config.

```bash
runtime-env gen-js --output-file ./dist/runtime-env.js
```

## Interpolate HTML or text when needed

Use `interpolate` when HTML/text assets need deploy-time substitution.

```bash
runtime-env interpolate --input-file ./dist/index.html --output-file ./dist/index.html
```

Example template snippet:

```html
<title><%= runtimeEnv.APP_TITLE %></title>
```

Related: [CLI interpolate](/cli/interpolate).
