# Vite preview behavior

`vite preview` simulates runtime generation without mutating build artifacts.

## Behavior

- `runtime-env.js` is generated on request.
- `dist/index.html` is read and interpolated via temp files.
- Schema validation still runs.

Use preview to verify startup/runtime behavior before deployment.
