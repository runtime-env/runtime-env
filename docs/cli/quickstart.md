# CLI quickstart

## Introduction

`@runtime-env/cli` is framework-agnostic and usable in any tech stack or workflow, not only deployment/startup scripts.

It works for non-Vite stacks, custom CI/CD pipelines, local development flows, and standalone runtime/template generation tasks.

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
console.log(runtimeEnv.API_BASE_URL);
```

For static hosting and test pipelines, this same pattern can be run before serving assets or before executing tests.

Deeper command behavior is documented in the command pages.

## Next steps

- [gen-js](/cli/gen-js)
- [gen-ts](/cli/gen-ts)
- [interpolate](/cli/interpolate)
- [CLI troubleshooting](/cli/troubleshooting)
