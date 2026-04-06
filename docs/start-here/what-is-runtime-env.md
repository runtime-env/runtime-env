# What is runtime-env?

runtime-env solves the problem of frontend configuration changing between deploys.

## Why it exists

Frontend values like API URLs, app titles, or feature toggles often differ by environment. If those values are compiled into bundles, each environment requires a new build.

runtime-env separates config from code so you can keep a single build artifact and apply environment values later.

## Build once, deploy anywhere

A typical flow is:

1. Build the app once.
2. During deployment/startup, generate runtime config from environment variables.
3. Load runtime config in the browser.

## Two core runtime techniques

- **Runtime JS generation**: generate `runtime-env.js` and load it before app startup.
- **Interpolation**: substitute runtime values into HTML/text templates at deploy/startup time.
