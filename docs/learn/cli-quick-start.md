# CLI quick start

## What you will build

A simple page that loads runtime config from generated JS.

## What you will learn

- How `gen-js`, `gen-ts`, and `interpolate` work together.

## Steps

1. Install CLI:

```bash
npm i -D @runtime-env/cli
```

2. Create `.runtimeenvschema.json`:

```json
{
  "type": "object",
  "properties": {
    "TITLE": { "type": "string" }
  },
  "required": ["TITLE"]
}
```

3. Set env values and create runtime file:

```bash
export TITLE="Hello"
npx runtime-env gen-js --output-file runtime-env.js
```

4. Load it before your app script:

```html
<script src="./runtime-env.js"></script>
<script src="./index.js"></script>
```

5. Optional: create TypeScript types:

```bash
npx runtime-env gen-ts --output-file runtime-env.d.ts
```

6. Optional: interpolate non-JS files:

```bash
npx runtime-env interpolate --input-file index.html --output-file index.html
```

## Recap

The CLI gives more control for non-Vite apps or custom startup flows.

## Next step

Go to [Mental model](/learn/mental-model).
