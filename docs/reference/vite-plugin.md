# Vite plugin reference

## API

```ts
import runtimeEnv from "@runtime-env/vite-plugin";

runtimeEnv(); // no options
```

## Conventions

- schema file: `.runtimeenvschema.json`
- runtime script path:
  - default base: `/runtime-env.js`
  - non-root base example: `/my-app/runtime-env.js`
- generated TypeScript declarations (TS projects): `src/runtime-env.d.ts`

## Lifecycle coverage

The plugin covers the Vite lifecycle: dev, build, preview, and Vitest.

## Internal dependency

The plugin uses `@runtime-env/cli` internally.

Related: [Vite builtin env comparison](/vite/builtin-env-comparison).
