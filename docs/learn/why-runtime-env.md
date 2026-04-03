# Why runtime-env

## What you'll build

A web app that reads configuration from a runtime-loaded script.

## What you'll learn

- Why build-time env injection causes rebuilds per environment.
- How runtime injection supports "build once, deploy anywhere."

## One concept

Traditional build-time env systems (for example `import.meta.env`) compile values into bundles. That means changing a variable requires a rebuild.

`runtime-env` moves that config into a separate runtime file (`runtime-env.js`) so you can keep one build and swap configuration per deployment.

## Recap

- Build artifacts stay generic.
- Runtime values are validated through schema.
- Deploy-time startup can generate environment-specific config.

## Next step

Continue to [Vite quick start](/learn/vite-quick-start).
