# Vite plugin reference

## Package

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

## Fixed conventions

- Schema file: `.runtimeenvschema.json`
- Global variable: `runtimeEnv`
- Generated types: `src/runtime-env.d.ts`
- Required HTML script: `<script src="/runtime-env.js"></script>` before app entry
- Schema keys must match Vite env prefix expectations (default `VITE_`)

## API

```ts
import runtimeEnv from '@runtime-env/vite-plugin'

runtimeEnv()
```

No options are accepted.

## Behavior matrix

- **dev:** generate JS + TS, serve/interpolate, watch and reload
- **build:** validate schema + generate TS only
- **preview:** serve runtime JS + interpolated HTML without writing to `dist`
- **test:** generate TS and inject runtime JS for Vitest
