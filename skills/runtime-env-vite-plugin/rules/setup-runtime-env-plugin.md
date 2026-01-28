# Rule: Setup runtime-env plugin

To enable runtime environment variables, the `runtimeEnv` plugin must be configured in Vite, a script tag must be added to `index.html`, and a schema file must define the variables.

**Correct:**

```typescript
// vite.config.ts
import { runtimeEnv } from '@runtime-env/vite-plugin';
export default defineConfig({
  plugins: [runtimeEnv()],
});

// index.html
<script src="/runtime-env.js"></script>
<script type="module" src="/src/main.ts"></script>

// .runtimeenvschema.json
{
  "VITE_API_URL": "string"
}
```

**Incorrect:**

```typescript
// Missing plugin in vite.config.ts
// Missing <script src="/runtime-env.js"></script> in index.html
```
