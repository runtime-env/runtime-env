# What is runtime-env?

runtime-env exists because frontend configuration often changes between deploys.

## Why it exists

Values such as API URLs, app titles, feature flags, and third-party IDs vary across environments. When those values are baked into built assets, every change can force another rebuild.

runtime-env separates config from code so teams can reuse one build artifact and apply environment-specific values later.

## Core capabilities

runtime-env supports:

- **runtime JS generation** (for example, generating `runtime-env.js`),
- **interpolation** (substituting runtime values into HTML/text templates).

`@runtime-env/cli` is framework-agnostic and usable in any stack or workflow, not only deployment scripts.
