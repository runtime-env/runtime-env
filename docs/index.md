# runtime-env

runtime-env helps frontend teams externalize configuration so one build artifact can be reused across environments.

In Twelve-Factor terms, config should stay separate from code so teams can build once and deploy anywhere.

## What runtime-env aims to solve

### Different stages need different API URLs

If the API URL is baked into the build, teams often rebuild for every stage or risk shipping the wrong backend URL.

#### Before

```ts
const response = await fetch(`${process.env.API_BASE_URL}/users`);
```

#### After

```ts
const response = await fetch(`${runtimeEnv.API_BASE_URL}/users`);
```

### Different environments use different Firebase projects

If deployment tooling swaps the wrong Firebase config, schema-driven declarations help catch the mismatch earlier and keep app code typed.

#### Before

```ts
const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG!));
```

#### After

```ts
const app = initializeApp(runtimeEnv.FIREBASE_CONFIG);
```

### Different stages should report to different analytics properties

If the analytics ID is baked into HTML, teams can easily send data from the wrong stage to the wrong property.

#### Before

```html
<script>
  gtag('config', 'G-PROD123456');
</script>
```

#### After

```html
<script>
  gtag('config', '<%= runtimeEnv.GA_MEASUREMENT_ID %>');
</script>
```

## Quickstart

- [Vite quickstart](/vite/quickstart)
- [CLI quickstart](/cli/quickstart)
