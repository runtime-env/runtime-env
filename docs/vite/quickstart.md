# Vite quickstart

## Introduction

Use this path when your app uses Vite. `@runtime-env/vite-plugin` is the high-level Vite integration, and it invokes `@runtime-env/cli` internally.

## Installation

```bash
npm i -D @runtime-env/vite-plugin @runtime-env/cli
```

## Minimal setup

`vite.config.ts`

```ts
import { defineConfig } from "vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

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

`.env`

```bash
VITE_API_BASE_URL=https://api.example.com
```

`index.html`

```html
<!-- default base -->
<script src="/runtime-env.js"></script>

<!-- non-root base example -->
<script src="/my-app/runtime-env.js"></script>

<script type="module" src="/src/main.ts"></script>
```

`src/main.ts`

```ts
console.log(globalThis.runtimeEnv.VITE_API_BASE_URL);
```

## Next steps

- [Vite dev](/vite/dev)
- [Vite test](/vite/test)
- [Vite build](/vite/build)
- [Vite preview](/vite/preview)
- [Vite troubleshooting](/vite/troubleshooting)
