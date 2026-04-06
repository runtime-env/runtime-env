# runtime-env docs

runtime-env helps frontend teams externalize configuration so one build artifact can be reused across environments.

In Twelve-Factor terms, config should stay separate from code so teams can build once and deploy anywhere.

## Quickstart

- [Vite quickstart](/vite/quickstart)
- [CLI quickstart](/cli/quickstart)

## CLI output examples

### `gen-js` example — API URL (`API_BASE_URL`)

API URLs usually differ between local, staging, and production. If `API_BASE_URL` is baked into the build, teams often rebuild the entire frontend for every stage. That creates extra release friction and increases the chance that the wrong artifact is promoted.

A wrong API URL in production can send traffic to the wrong backend, causing broken behavior or downtime. `gen-js` avoids that by generating runtime config after build so each stage can supply the correct `API_BASE_URL` without rebuilding.

### `gen-ts` example — Firebase config (`FIREBASE_CONFIG`)

Firebase config also varies by environment or service. In multi-project setups, deployment tooling can accidentally swap in the wrong Firebase project settings.

Using `gen-ts` with a schema helps validate the expected shape ahead of deployment and gives typed access in app code. This lowers the chance of shipping the wrong `FIREBASE_CONFIG` and connecting to the wrong service.

### `interpolate` example — analytics id (`GA_MEASUREMENT_ID`)

Analytics IDs differ across stages. If the wrong `GA_MEASUREMENT_ID` is served, data is sent to the wrong property and teams lose trustworthy reporting.

This commonly happens when analytics config is baked into a build or when the wrong template values are swapped during release. `interpolate` avoids rebuilds and helps reduce wrong-stage configuration issues by substituting values at runtime/template-processing time.
