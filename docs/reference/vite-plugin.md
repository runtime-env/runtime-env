# Vite plugin reference

## Install

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

## Fixed rules

- Schema file: `.runtimeenvschema.json`
- Global variable: `runtimeEnv`
- TS types path: `src/runtime-env.d.ts`
- Required HTML script: `<script src="/runtime-env.js"></script>` before app entry
- Schema keys must match Vite env prefix rules (default `VITE_`)

## API

```ts
import runtimeEnv from "@runtime-env/vite-plugin";

runtimeEnv();
```

The plugin takes no options.

## Mode matrix

- **dev:** makes JS + TS, serves/interpolates, watches and reloads
- **build:** checks schema + makes TS only
- **preview:** serves runtime JS + interpolated HTML, does not write to `dist`
- **test:** makes TS and injects runtime JS for Vitest
