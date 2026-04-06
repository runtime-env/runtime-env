# CLI quickstart

## Introduction

`@runtime-env/cli` is framework-agnostic and designed for deployment/runtime lifecycle workflows.

## Installation

```bash
npm i -D @runtime-env/cli
```

## Minimal setup

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

Generate runtime JavaScript:

```bash
API_BASE_URL=https://api.example.com npx @runtime-env/cli gen-js --output-file ./dist/runtime-env.js
```

Load it in HTML:

```html
<script src="/runtime-env.js"></script>
```

Read it in app code:

```ts
console.log(globalThis.runtimeEnv.API_BASE_URL);
```

Deeper command behavior is documented in the command pages.

## Next steps

- [gen-js](/cli/gen-js)
- [gen-ts](/cli/gen-ts)
- [interpolate](/cli/interpolate)
- [CLI troubleshooting](/cli/troubleshooting)
