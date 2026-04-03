# Startup generation

Generate `runtime-env.js` when the process starts, not at bundle build time.

## Why

- avoids per-environment rebuilds,
- keeps runtime values outside immutable bundle artifacts.

## Example

```bash
npx @runtime-env/cli gen-js --output-file ./dist/runtime-env.js
exec nginx -g 'daemon off;'
```
