## Context

The `runtime-env-vite-plugin` skill needs to be refactored to be more effective for AI agents. The new structure will follow the "composition patterns" approach, where each rule is defined in its own file within a `rules/` directory and explicitly documented as scenarios in the `agent-skills` specification.

## Proposed File Structure

```
skills/runtime-env-vite-plugin/
├── SKILL.md (Metadata and overview)
└── rules/
    ├── setup-runtime-env-plugin.md
    ├── use-runtime-public-env-in-js-ts.md
    └── use-runtime-public-env-in-index-html.md
```

## Specification Alignment

The `openspec/specs/agent-skills/spec.md` has been updated to include individual scenarios for each of the rules below, ensuring the specification remains the source of truth for skill requirements.

## Proposed Rules and File Contents

### `rules/setup-runtime-env-plugin.md`

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

### `rules/use-runtime-public-env-in-js-ts.md`

Dynamic variables (configurable after build and before runtime) must be accessed via `runtimeEnv.PREFIX_VARIABLE_NAME`. Do not use `import.meta.env`.

**Correct:**

```typescript
const apiUrl = runtimeEnv.VITE_API_URL;
```

**Incorrect:**

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### `rules/use-runtime-public-env-in-index-html.md`

Use `<%= runtimeEnv.PREFIX_VARIABLE_NAME %>` placeholders in `index.html` for dynamic values that should be interpolated at startup. Do NOT use Vite's build-time `%VARIABLE_NAME%` syntax.

**Correct:**

```html
<title><%= runtimeEnv.VITE_APP_TITLE %></title>
```

**Incorrect:**

```html
<title>%VITE_APP_TITLE%</title>
```
