# Mental model

## What you will learn

How runtime-env works in each Vite mode and in production.

## Mode behavior

- **Dev:** makes JS and TS, serves `/runtime-env.js`, updates HTML, and watches env/schema files.
- **Build:** checks schema and makes TS only.
- **Preview:** serves runtime JS and interpolated HTML without changing `dist`.
- **Test (Vitest):** injects runtime JS in test setup and makes TS types.

## Production model

In production, create `runtime-env.js` at startup.
For example, do this in a container entry script.

## Recap

Your build stays reusable.
Runtime values are created where deploy context is known.
