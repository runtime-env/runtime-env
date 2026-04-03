# Vite `index.html` requirements

`index.html` must include the runtime script tag:

```html
<script src="/runtime-env.js"></script>
```

Place it before your main entry script so app code can read `globalThis.runtimeEnv` during startup.

The plugin validates this and fails (or logs an error in dev) when missing.
