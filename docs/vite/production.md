# Vite production

In production, still generate `runtime-env.js` at startup.

## Key rule

The plugin helps in dev/build/preview/test workflows, but production runtime values should be generated when the container/server starts.

## Typical flow

1. Build static assets once.
2. Start container/process.
3. Run CLI `gen-js` using deployment env variables.
4. Serve app with fresh `runtime-env.js`.

```bash
runtime-env-cra gen-js --output-file ./dist/runtime-env.js
```

(Use your package runner / binary naming for your setup.)
