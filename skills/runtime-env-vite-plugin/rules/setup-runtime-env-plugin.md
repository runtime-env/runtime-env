# Setup runtime-env plugin

To enable runtime environment variables, you MUST install the plugin, configure it in Vite, add a script tag to `index.html`, define a valid JSON schema in `.runtimeenvschema.json`, remove any existing Vite environment definitions, and migrate any existing environment variable usages.

## Correct

1. **Install the plugin:** Use the project's package manager (e.g., `npm install @runtime-env/cli @runtime-env/vite-plugin --save-dev`).

2. **Configure Vite:** Create or update `vite.config.ts` (or `vite.config.js`) to include the plugin:

```typescript
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

3. **Add script tag:** The script tag to load `runtime-env.js` MUST be added before any other script tags in `index.html`:

```html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>
```

> [!IMPORTANT]
> You MUST ignore warnings like "can't be bundled without type='module' attribute" for the `/runtime-env.js` script tag. This is expected as it's a plain script served at runtime.

4. **Create schema file:** A `.runtimeenvschema.json` file MUST be created at the project root with a valid JSON schema structure. If there are no environment variables yet, you must still create an empty schema like this:

```json
// .runtimeenvschema.json
{
  "type": "object",
  "properties": {},
  "required": []
}
```

5. **Remove existing Vite env definitions:** Delete or comment out any custom `ImportMetaEnv` or `ImportMeta` definitions in `src/vite-env.d.ts` (or similar files) as they are now redundant and managed by `runtimeEnv`. You MUST NOT manually add types for environment variables in any files.

6. **Gitignore:** The generated type file (e.g., `src/runtime-env.d.ts`) MUST NOT be added to `.gitignore`.

7. **Migrate existing code:** After setup, you MUST migrate all existing environment variable usages by following the other rules in this skill.

## Incorrect

```typescript
import { runtimeEnv } from "@runtime-env/vite-plugin"; // Named import is incorrect

export default defineConfig({
  plugins: [], // Missing runtimeEnv() plugin
});
```

```json
// .runtimeenvschema.json
{
  "VITE_API_URL": "string" // This is NOT a valid JSON schema
}
```

```html
<!-- Missing the runtime-env.js script tag -->
<!-- index.html -->
<script type="module" src="/src/main.ts"></script>
```

```html
<!-- Incorrect order -->
<!-- index.html -->
<script type="module" src="/src/main.ts"></script>
<script src="/runtime-env.js"></script>
```

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

// INCORRECT: Keeping custom env definitions alongside runtime-env
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

```
// .gitignore
/src/runtime-env.d.ts // This file MUST NOT be ignored
```

```typescript
// Existing code using import.meta.env without migration
const apiUrl = import.meta.env.VITE_API_URL;
```

```html
<!-- Existing code using import.meta.env without migration -->
<title>%VITE_APP_TITLE%</title>
```
