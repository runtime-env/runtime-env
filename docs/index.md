# runtime-env docs

runtime-env helps frontend teams externalize runtime configuration so one build artifact can be reused across environments.

In Twelve-Factor terms, config should stay separate from code so you can build once and deploy anywhere.

## Start here

- [Start Here](/start-here/what-is-runtime-env)
- [Vite quickstart](/vite/quickstart)
- [CLI quickstart](/cli/quickstart)

## CLI output examples

### `gen-js` example (API URL)

Define `API_BASE_URL` in your schema and generate runtime JS, then read it in app code as `runtimeEnv.API_BASE_URL`.

### `gen-ts` example (Firebase config)

Define `FIREBASE_CONFIG` in your schema and generate declarations so your code gets typed access to `runtimeEnv.FIREBASE_CONFIG`.

### `interpolate` example (GA measurement id)

Place a placeholder such as `GA_MEASUREMENT_ID` in HTML/text templates and use interpolation to insert the runtime value during generation.
