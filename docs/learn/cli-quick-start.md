# CLI quick start

## What you'll build

A framework-agnostic page that loads runtime config from generated JavaScript.

## What you'll learn

- How `gen-js`, `gen-ts`, and `interpolate` fit together.

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

3. Export environment values and generate runtime file:

```bash
export TITLE="Hello"
npx runtime-env gen-js --output-file runtime-env.js
```

4. Load it before your app script:

```html
<script src="./runtime-env.js"></script>
<script src="./index.js"></script>
```

5. Optional: generate TypeScript declarations:

```bash
npx runtime-env gen-ts --output-file runtime-env.d.ts
```

6. Optional: interpolate non-JS files:

```bash
npx runtime-env interpolate --input-file index.html --output-file index.html
```

## Recap

The CLI gives full control for non-Vite or custom startup workflows.

## Next step

Continue to [Mental model](/learn/mental-model).
