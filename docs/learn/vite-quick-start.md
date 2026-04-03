# Vite quick start

## What you will build

A Vite app that reads `runtimeEnv.VITE_API_URL` at runtime.

## What you will learn

- The fixed rules used by `@runtime-env/vite-plugin`.

## Steps

1. Install packages:

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

2. Add a schema file in project root:

```json
{
  "type": "object",
  "properties": {
    "VITE_API_URL": { "type": "string" }
  },
  "required": ["VITE_API_URL"]
}
```

3. Add the plugin in `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

4. Add this script before your app entry in `index.html`:

```html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>
```

5. Use the value in your app code:

```ts
console.log(runtimeEnv.VITE_API_URL);
```

## Recap

The plugin has no options.
It uses fixed names like `.runtimeenvschema.json`, `runtimeEnv`, and `/runtime-env.js`.

## Next step

Go to [CLI quick start](/learn/cli-quick-start).
