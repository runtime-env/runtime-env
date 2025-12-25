# @runtime-env/vite-plugin

Zero-config Vite plugin for `runtime-env`.

## Installation

```sh
npm install --save-dev @runtime-env/vite-plugin
```

## Setup

Before using the plugin, ensure you have the following prerequisites in your project:

1.  **Define your environment schema**
    Create a `.runtimeenvschema.json` file in your project root to define the structure and validation of your environment variables:
    ```json
    {
      "type": "object",
      "properties": {
        "API_URL": { "type": "string" }
      },
      "required": ["API_URL"]
    }
    ```
2.  **Provide local environment variables**
    Create a `.env` (or `.env.local`, `.env.development`, etc.) file to provide values for development:
    ```env
    API_URL=http://localhost:3000
    ```
3.  **Load the runtime environment**
    Add a `<script>` tag to your `index.html` **before** your main entry point to load the generated environment variables:
    ```html
    <script src="/runtime-env.js"></script>
    ```
    > [!IMPORTANT]
    > In production, you are responsible for generating `/runtime-env.js` and (optionally) interpolating files at startup (e.g., in your Docker entrypoint) using the `@runtime-env/cli`.

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
```

### Accessing Variables

**In JavaScript/TypeScript:**

```ts
// Variables are available globally
const apiUrl = runtimeEnv.API_URL;
```

**In `index.html` (Template Interpolation):**

```html
<!-- Use lodash-style templates -->
<script src="https://maps.googleapis.com/maps/api/js?key=<%= runtimeEnv.GOOGLE_MAPS_API_KEY %>"></script>
```

That's it! The plugin automatically handles the following:

- **Development**: Dynamically serves `/runtime-env.js` and watches for changes in `.env` files or your schema.
- **Build**: Only runs `gen-ts` to ensure your type definitions are up-to-date. It **does not** generate `runtime-env.js` or interpolate `index.html`, ensuring your build artifacts remain generic and environment-agnostic.
- **Preview**: Hooks into the Vite preview server to generate `/runtime-env.js` and perform HTML interpolation on the fly, allowing you to test your production build locally.
- **Testing (Vitest)**: Automatically generates a temporary `runtime-env.js` and injects it into Vitest's `setupFiles`, providing `globalThis.runtimeEnv` during your tests.

## Why runtime-env?

Vite's built-in `import.meta.env` is **build-time**. This means environment variables are "baked into" your JavaScript bundles during the build process, requiring a full rebuild for every environment (e.g., staging, production, or per-customer deployments).

`@runtime-env` enables the **"Build once, deploy anywhere"** philosophy. By loading environment variables from a separate `/runtime-env.js` file at runtime, you can:

- Use the **exact same Docker image** or build artifact across all environments.
- Update configuration in seconds without a CI/CD rebuild.
- Ensure strict validation of environment variables via JSON Schema.

## Advanced Usage

For more details on the underlying mechanics and CLI options, refer to the [main documentation](https://github.com/runtime-env/runtime-env#runtime-env).
