# Docker startup generation

Use a startup script to create `runtime-env.js` when the container starts.

## Why

This keeps the build static and the runtime config dynamic.

## Pattern

1. Build your app once.
2. At container startup, run:

```bash
runtime-env gen-js --output-file dist/runtime-env.js
```

3. Serve `dist` and avoid long cache for `runtime-env.js`.

## Example

See the production example startup script in this repo.
