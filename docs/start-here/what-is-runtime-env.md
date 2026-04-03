# What is runtime-env?

Use runtime-env when you need frontend configuration at deploy/startup time instead of build time.

## Problem it solves

Without runtime-env, frontend env values are usually baked into bundles during build. That forces rebuilds for every environment.

With runtime-env:

1. Build once.
2. Generate `runtime-env.js` when the app starts.
3. Read values from `globalThis.runtimeEnv` in browser code.

## Smallest example

```html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>
```

```ts
console.log(globalThis.runtimeEnv.API_BASE_URL);
```

## Common mistake

Forgetting to include `runtime-env.js` before your app entry script.
