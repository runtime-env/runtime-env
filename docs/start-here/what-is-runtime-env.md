# What is runtime-env?

runtime-env solves the problem of frontend configuration changing between deploys.

## Why it exists

Values such as API URLs, app titles, and feature flags vary by environment. If those values are baked into built assets, every environment change can require a rebuild.

runtime-env separates config from code so you can keep a single build artifact and apply environment-specific values later.

## Build once, deploy anywhere

A common flow is:

1. Build the app once.
2. Generate runtime values from environment data.
3. Load runtime values at app start.

## Two core capabilities

- **Runtime JS generation**: generate `runtime-env.js` and load it before app startup.
- **Interpolation**: substitute runtime values into HTML/text templates.

`@runtime-env/cli` is framework-agnostic and usable in any stack or workflow, not only deployment scripts.
