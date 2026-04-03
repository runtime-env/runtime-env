# Vite plugin reference

## API

```ts
import runtimeEnv from "@runtime-env/vite-plugin";

runtimeEnv(); // no options
```

## Conventions

- schema file: `.runtimeenvschema.json`
- runtime script path: `/runtime-env.js`
- generated TS path (if TS project): `src/runtime-env.d.ts`

## Behavior summary

- Returns plugin set for dev/build/preview/test.
- Validates schema in each mode.
- Enforces runtime script tag presence for app correctness.
