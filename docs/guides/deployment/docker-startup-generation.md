# Docker startup generation

Use startup scripts to generate `runtime-env.js` when the container starts.

## Why

This preserves the "build once, deploy anywhere" workflow: the image is static, runtime config is dynamic.

## Pattern

1. Build your app once.
2. In container startup, run:

```bash
runtime-env gen-js --output-file dist/runtime-env.js
```

3. Serve `dist` and ensure `runtime-env.js` is not long-term cached.

## Example

See the repository production example startup script for a concrete implementation.
