# Vite `index.html` requirements

`index.html` must include the runtime script tag:

```html
<!-- base "/" -->
<script src="/runtime-env.js"></script>

<!-- non-root base -->
<script src="${base}/runtime-env.js"></script>
```

Place it before your main entry script so app code can read `globalThis.runtimeEnv` during startup.

The plugin validates this in every mode:

- **dev**: logs an error/overlay and explains that runtime values will not be available until the script is added.
- **build**: treated as a hard failure.
- **path validation**: checks the script path using the resolved Vite base (`/runtime-env.js` for base `/`, `${base}/runtime-env.js` for non-root base).
