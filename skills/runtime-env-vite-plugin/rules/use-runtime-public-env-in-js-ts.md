# Use runtime public env in JS/TS

For Vite projects, environment variables are handled differently based on whether they are managed by `runtime-env` (typically prefixed with `VITE_`) or are Vite's built-in variables.

## Correct

- Any variable WITH the `VITE_` prefix (or the configured prefix) MUST be accessed via `runtimeEnv.VAR_NAME`.
- Any variable WITHOUT the prefix (e.g.,`MODE`, `DEV`) MUST continue to be accessed via `import.meta.env.VAR_NAME`.

```typescript
// Variables with prefix (managed by runtime-env)
const apiUrl = runtimeEnv.VITE_API_URL;

// Variables without prefix (usually built-in Vite variables)
if (import.meta.env.DEV) {
  console.log("Running in dev mode");
}
```

## Incorrect

```typescript
// Don't use import.meta.env for prefixed variables
const apiUrl = import.meta.env.VITE_API_URL;

// Don't use runtimeEnv for non-prefixed variables
const mode = runtimeEnv.MODE;
```
