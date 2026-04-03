# Vite quickstart

Use this for the fastest working Vite setup.

## Install

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

## Add plugin

```ts
import { defineConfig } from "vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

## Create schema

`.runtimeenvschema.json`

```json
{
  "type": "object",
  "properties": {
    "VITE_API_BASE_URL": { "type": "string" }
  },
  "required": ["VITE_API_BASE_URL"]
}
```

## Create env

`.env`

```bash
VITE_API_BASE_URL=https://api.example.com
```

## Add runtime script to `index.html`

```html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>
```

## Read value in app code

```ts
console.log(globalThis.runtimeEnv.VITE_API_BASE_URL);
```

## Common mistake

Missing `<script src="/runtime-env.js"></script>` or putting it after the app entry script.
