# Vite quick start

## What you'll build

A Vite app that reads `runtimeEnv.VITE_API_URL` at runtime.

## What you'll learn

- The required Vite conventions used by `@runtime-env/vite-plugin`.

## Steps

1. Install dependencies:

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

2. Add schema in project root:

```json
{
  "type": "object",
  "properties": {
    "VITE_API_URL": { "type": "string" }
  },
  "required": ["VITE_API_URL"]
}
```

3. Register plugin in `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import runtimeEnv from '@runtime-env/vite-plugin'

export default defineConfig({
  plugins: [runtimeEnv()]
})
```

4. Add runtime script before your app entry in `index.html`:

```html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>
```

5. Access config in code:

```ts
console.log(runtimeEnv.VITE_API_URL)
```

## Recap

The plugin is zero-config and depends on fixed conventions (`.runtimeenvschema.json`, `runtimeEnv`, and `/runtime-env.js`).

## Next step

Continue to [CLI quick start](/learn/cli-quick-start).
