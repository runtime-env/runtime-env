# @runtime-env/next-plugin

Zero-config Next.js plugin for `runtime-env`.

## Installation

```sh
npm install --save-dev @runtime-env/next-plugin
```

## Setup

Before using the plugin, ensure you have the following prerequisites in your project:

1.  **Define your environment schema**
    Create a `.runtimeenvschema.json` file in your project root. **Note:** Only keys starting with `NEXT_PUBLIC_` are supported.
    ```json
    {
      "type": "object",
      "properties": {
        "NEXT_PUBLIC_API_URL": { "type": "string" }
      },
      "required": ["NEXT_PUBLIC_API_URL"]
    }
    ```
2.  **Provide local environment variables**
    Create a `.env` (or `.env.local`, `.env.development`, etc.) file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

## Usage

### 1. Configure `next.config.js`

Wrap your Next.js configuration with `withRuntimeEnv`:

```ts
import { withRuntimeEnv } from "@runtime-env/next-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withRuntimeEnv(nextConfig);
```

### 2. Add the Script Component

Add the `<RuntimeEnvScript />` component to your root layout (App Router) or `_document` (Pages Router).

**App Router (`app/layout.tsx`):**

```tsx
import { RuntimeEnvScript } from "@runtime-env/next-plugin";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <RuntimeEnvScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Accessing Variables

Variables are available globally via `runtimeEnv`:

```ts
const apiUrl = runtimeEnv.NEXT_PUBLIC_API_URL;
```

> [!TIP]
> The plugin automatically handles mapping `runtimeEnv` to the most robust access pattern for both client and server (`(typeof window !== 'undefined' ? window : process.env).runtimeEnv`), ensuring stability during Next.js prerendering and static generation.

## Why runtime-env?

Next.js's native `NEXT_PUBLIC_` variables are **build-time**. They are "baked into" your bundles during `next build`, requiring a full rebuild for every environment.

`@runtime-env` enables the **"Build once, deploy anywhere"** philosophy. You can:

- Use the **exact same Docker image** across all environments.
- Update configuration without a CI/CD rebuild.
- Ensure strict validation via JSON Schema.

## Advanced: Server-Side Parity

To ensure `runtimeEnv` is also available and validated on the server (e.g., in Server Components or Middleware), you can use the `instrumentation.ts` hook:

```ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { populateRuntimeEnv } =
      await import("@runtime-env/next-plugin/server");
    populateRuntimeEnv();
  }
}
```

For more details, refer to the [main documentation](https://github.com/runtime-env/runtime-env).
