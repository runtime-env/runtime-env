# 01 - Setup

This phase focuses on installing and configuring the `@runtime-env/vite-plugin` and establishing the core infrastructure for runtime environment variables.

## Prerequisites

- A Vite-based project.
- Access to the project's package manager (npm, yarn, pnpm).

## Steps

### 1. Remove Legacy Type Definitions

Remove any custom `ImportMetaEnv` or `ImportMeta` definitions (typically found in `src/vite-env.d.ts`). These are now redundant and will conflict with `runtimeEnv`.

- **Action**: Delete the manual interface definitions. Keep `/// <reference types="vite/client" />` if it exists.

### 2. Install Dependencies

Install the CLI and the Vite plugin.

- **Action**: `npm install @runtime-env/cli @runtime-env/vite-plugin --save-dev` (or equivalent).

### 3. Configure Vite

Add the `runtimeEnv` plugin to your `vite.config.ts` or `vite.config.js`.

- **Action**: Add the import and append `runtimeEnv()` to the `plugins` array.
- **CRITICAL**: Do **NOT** modify other settings like aliases, base paths, build targets, or existing plugins. Preserve the original file structure.

  ```typescript
  import runtimeEnv from "@runtime-env/vite-plugin";

  export default defineConfig({
    // ... preserve existing config
    plugins: [
      // ... keep existing plugins
      runtimeEnv(),
    ],
  });
  ```

### 4. Update `index.html`

Add the script tag for `runtime-env.js`. It **MUST** be placed before the main application entry point.

- **Action**:
  ```html
  <script src="/runtime-env.js"></script>
  <script type="module" src="/src/main.ts"></script>
  ```
- **Note**: Ignore any "can't be bundled without type='module'" warnings for the `/runtime-env.js` tag.

### 5. Initialize Schema

Create a `.runtimeenvschema.json` file at the project root.

- **Action**: Create the file with an empty schema.
- **CRITICAL**: Do **NOT** use the `default` keyword in the schema.

  ```json
  {
    "type": "object",
    "properties": {},
    "required": []
  }
  ```

### 6. Generate Initial Types

Generate the initial TypeScript definitions to satisfy the compiler.

- **Action**: `npx runtime-env gen-ts --output-file src/runtime-env.d.ts`
- **Action**: Add `src/runtime-env.d.ts` to `.gitignore`.
- **Note**: Trust the CLI output. If it reports success, do not attempt to manually read the file if it is gitignored.

### 7. Update Build Script

Update the `build` script in `package.json` to ensure types are generated before type-checking.

- **Action**: Update the existing `build` script to `"vite build && tsc"` (or similar sequence).
- **Prohibition**: Do **NOT** add new scripts like `gen-ts` or `gen-js`. Manual generation should be done via temporary CLI commands, not permanent project scripts.

## Verification

Before proceeding to `02-discovery.md`, verify:

- [ ] `vite.config.ts` includes `runtimeEnv()`.
- [ ] `index.html` has `<script src="/runtime-env.js"></script>` before the app entry.
- [ ] `.runtimeenvschema.json` exists.
- [ ] `src/runtime-env.d.ts` is in `.gitignore`.
- [ ] No `ImportMetaEnv` definitions remain in `src/vite-env.d.ts`.
