# Mental model

## What you'll learn

How runtime-env behavior differs across Vite modes and production startup.

## Mode behavior

- **Dev:** generates JS and TS, serves `/runtime-env.js`, interpolates HTML, and watches schema/env changes.
- **Build:** validates schema and generates TS only. It does not emit runtime JS into the build output.
- **Preview:** serves runtime JS and interpolated HTML over the preview server without mutating `dist`.
- **Test (Vitest):** injects generated runtime JS into test setup and generates TS types.

## Production model

In production, generate `runtime-env.js` at startup (container entrypoint or deployment init), then serve it with no/short cache.

## Recap

Build output remains reusable; runtime values are produced where deployment context is known.
