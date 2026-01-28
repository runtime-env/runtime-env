# Rule: Use runtime public env in JS/TS

Dynamic variables (configurable after build and before runtime) must be accessed via `runtimeEnv.PREFIX_VARIABLE_NAME`. Do not use `import.meta.env`.

**Correct:**

```typescript
const apiUrl = runtimeEnv.VITE_API_URL;
```

**Incorrect:**

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```
