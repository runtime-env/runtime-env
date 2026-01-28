# Add new environment variables

When adding new environment variables, you MUST define them in `.runtimeenvschema.json`. `runtime-env` supports complex JSON types (objects, arrays) and will automatically parse them from environment variable strings at startup.

## Correct

- You MUST NOT manually add types for environment variables in any other files. The plugin will generate the necessary types based on the schema when you run the development server or build the project.
- You MUST carefully search how an environment variable is being used in the source code before migrating it. When an environment variable is being parsed or transformed in the source code, you MUST define it with the appropriate non-string type in the schema and stringify it during migration to keep changes minimal while ensuring validation.

### Schema Definition

```json
// .runtimeenvschema.json
{
  "type": "object",
  "properties": {
    "VITE_PORT": { "type": "number" },
    "VITE_FIREBASE_CONFIG": {
      "type": "object",
      "properties": {
        "apiKey": { "type": "string" },
        "projectId": { "type": "string" }
      },
      "required": ["apiKey", "projectId"]
    },
    "VITE_GOOGLE_TAG_ID": { "type": "string" }
  },
  "required": ["VITE_FIREBASE_CONFIG", "VITE_GOOGLE_TAG_ID"]
}
```

### Migration with existing parsing

```typescript
// Old code:
// const port = parseInt(import.meta.env.VITE_PORT || '3000');
// const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

// New code (minimal changes, but validated by schema):
const port = parseInt(
  JSON.stringify(
    typeof runtimeEnv.VITE_PORT === "number" ? runtimeEnv.VITE_PORT : 3000,
  ),
);
const firebaseConfig = JSON.parse(
  JSON.stringify(runtimeEnv.VITE_FIREBASE_CONFIG),
);
```

### Usage in index.html

```html
<!-- in HTML, runtimeEnv.* will be a string without quotes -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=<%= runtimeEnv.VITE_GOOGLE_TAG_ID %>"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "<%= runtimeEnv.VITE_GOOGLE_TAG_ID %>");
</script>
```

### Usage in JS/TS

```typescript
import { initializeApp } from "firebase/app";

// runtimeEnv.* will have the correct type as per the schema
const app = initializeApp(runtimeEnv.VITE_FIREBASE_CONFIG);
```

## Incorrect

```json
// Don't just use string if it's parsed later
{
  "type": "object",
  "properties": {
    "VITE_PORT": { "type": "string" },
    "VITE_FIREBASE_CONFIG": { "type": "string" }
  },
  "required": ["VITE_FIREBASE_CONFIG"]
}
```
