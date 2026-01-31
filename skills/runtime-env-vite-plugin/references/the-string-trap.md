# The String Trap

In standard Vite or Node.js environments, environment variables (from `import.meta.env` or `process.env`) are always strings. This leads to the "String Trap," where developers must manually parse these strings into the types they actually need (numbers, booleans, objects).

## The Problem

Manual parsing logic is often scattered throughout the codebase:

```typescript
// DON'T DO THIS
const port = parseInt(import.meta.env.VITE_PORT || "3000", 10);
const isEnabled = import.meta.env.VITE_FEATURE_ENABLED === "true";
const config = JSON.parse(import.meta.env.VITE_COMPLEX_CONFIG || "{}");
```

This is brittle, prone to runtime errors, and clutters the business logic.

## The Solution: `runtimeEnv`

With `@runtime-env/vite-plugin`, you can define the expected type directly in `.runtimeenvschema.json`. The plugin handles the parsing, and the `runtimeEnv` global provides the correctly typed value.

### Step 1: Define the Type in Schema

Update your `.runtimeenvschema.json` with the target type:

| Legacy Usage      | Actual Intent | Schema Type     | Implementation                                   |
| :---------------- | :------------ | :-------------- | :----------------------------------------------- |
| `parseInt(VAR)`   | Numeric value | `number`        | `{"type": "number"}`                             |
| `VAR === 'true'`  | Boolean flag  | `boolean`       | `{"type": "boolean"}`                            |
| `switch(VAR)`     | Fixed options | `string` (enum) | `{"type": "string", "enum": ["a", "b"]}`         |
| `VAR.split(',')`  | List of items | `array`         | `{"type": "array", "items": {"type": "string"}}` |
| `JSON.parse(VAR)` | Complex data  | `object`        | `{"type": "object", "properties": {...}}`        |

#### Deep Discovery Examples

**Numeric values**
If you see: `const port = parseInt(runtimeEnv.VITE_PORT, 10);`
Define as:

```json
"VITE_PORT": { "type": "number" }
```

**Boolean flags**
If you see: `const isEnabled = runtimeEnv.VITE_FEATURE_ENABLED === 'true';`
Define as:

```json
"VITE_FEATURE_ENABLED": { "type": "boolean" }
```

**Enums**
If you see: `if (runtimeEnv.VITE_HTTP_PROTOCOL === 'http') { ... } else if (runtimeEnv.VITE_HTTP_PROTOCOL === 'https') { ... }`
Define as:

```json
"VITE_HTTP_PROTOCOL": { "type": "string", "enum": ["http", "https"] }
```

**Arrays**
If you see: `const allowedIpV4s = runtimeEnv.VITE_ALLOWED_IP_V4S.split(',');`
Define as:

```json
"VITE_ALLOWED_IP_V4S": {
  "type": "array",
  "items": { "type": "string", "format": "ipv4" }
}
```

**Objects (No Generics)**
If you see: `const firebaseConfig = JSON.parse(runtimeEnv.VITE_FIREBASE_CONFIG); console.log(firebaseConfig.apiKey);`
Define as:

```json
"VITE_FIREBASE_CONFIG": {
  "type": "object",
  "properties": {
    "apiKey": { "type": "string" },
    // ... other properties
  },
  "required": ["apiKey"]
}
```

_Note: Using `{"type": "object"}` without `properties` is strictly prohibited as it bypasses type safety._

### Step 2: Use the Typed Global

Remove the manual parsing logic and use `runtimeEnv` directly:

```typescript
// DO THIS
const port = runtimeEnv.VITE_PORT; // Already a number
const isEnabled = runtimeEnv.VITE_FEATURE_ENABLED; // Already a boolean
const config = runtimeEnv.VITE_COMPLEX_CONFIG; // Already an object
```

## Benefits

1.  **Cleaner Code**: Business logic is not obscured by parsing code.
2.  **Type Safety**: TypeScript definitions are automatically generated with the correct types.
3.  **Early Validation**: The plugin validates environment variables against the schema at startup, failing fast if the data is invalid.
