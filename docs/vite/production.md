# Vite production

In production, generate `runtime-env.js` at startup.

## Key rule

The Vite plugin helps with `dev`, `build`, `preview`, and `test` workflows. Production runtime injection is handled by the CLI when the container/server starts.

## Typical flow

1. Build static assets once.
2. Start container/process.
3. Run CLI `gen-js` using deployment env variables.
4. Serve app with fresh `dist/runtime-env.js`.

```bash
runtime-env gen-js --output-file ./dist/runtime-env.js
```

You can also run the same command via `npx`:

```bash
npx @runtime-env/cli gen-js --output-file ./dist/runtime-env.js
```
