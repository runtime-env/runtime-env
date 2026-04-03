# CLI quickstart

Use this for framework-agnostic setup.

## 1) Create schema

`.runtimeenvschema.json`

```json
{
  "type": "object",
  "properties": {
    "API_BASE_URL": { "type": "string" }
  },
  "required": ["API_BASE_URL"]
}
```

## 2) Provide env value

```bash
export API_BASE_URL=https://api.example.com
```

## 3) Generate runtime file

```bash
npx @runtime-env/cli gen-js --output-file ./public/runtime-env.js
```

## 4) Load file in HTML

```html
<script src="/runtime-env.js"></script>
```

## 5) Read in app code

```ts
console.log(globalThis.runtimeEnv.API_BASE_URL);
```
