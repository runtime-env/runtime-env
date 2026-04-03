# Why runtime-env

## What you will build

A web app that reads config from a runtime script.

## What you will learn

- Why build-time env values cause many rebuilds.
- How runtime values support "build once, deploy anywhere".

## One idea

Some tools put env values in your JS bundle at build time.
If a value changes, you must rebuild.

`runtime-env` moves config to a runtime file (`runtime-env.js`).
So you can keep one build and change values when you deploy.

## Recap

- Build output stays generic.
- Runtime values are checked by schema.
- Startup scripts can create env-specific config.

## Next step

Go to [Vite quick start](/learn/vite-quick-start).
