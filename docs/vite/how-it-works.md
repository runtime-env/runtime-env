# Vite plugin: how it works

This page explains real mode behavior.

## Dev (`vite dev`)

- validates schema,
- generates `runtime-env.js` and serves it,
- interpolates `index.html`,
- watches schema/env files,
- generates `src/runtime-env.d.ts` if `tsconfig.json` exists.

## Build (`vite build`)

- validates schema,
- checks for required `runtime-env.js` script tag,
- generates TS types for TS projects,
- does **not** bake runtime values into bundle output.

## Preview (`vite preview`)

- serves generated `runtime-env.js` dynamically,
- interpolates built `index.html` on request,
- keeps `dist` intact.

## Test (Vitest mode)

- validates schema,
- generates `runtime-env.js` for test setup injection,
- auto-adds generated file to Vitest `setupFiles`,
- generates TS declarations for TS projects.
