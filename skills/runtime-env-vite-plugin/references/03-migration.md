# 03 - Migration

The "Act" phase. Now that you have a plan from the Discovery phase, apply the changes to the codebase.

## Prerequisites

- Completion of `01-setup.md`.
- Completion of `02-discovery.md` (you have a drafted schema and identified manual parsing).

## Steps

### 1. Apply the Schema

Update `.runtimeenvschema.json` with all identified variables and their correct types.

- **Action**: Fill in the `properties` and `required` fields.
- **CRITICAL**: Do **NOT** use the `default` keyword in the schema. All environment values must originate from the environment.
- **Note**: Ensure variables with manual parsing (the "String Trap") use the correct target type (`number`, `boolean`, `object`).

### 2. Generate Types

Sync the TypeScript definitions with the new schema.

- **Action**: `npx runtime-env gen-ts --output-file src/runtime-env.d.ts`
- **Note**: Trust the CLI success output; do not attempt to verify the file if it is gitignored.

### 3. Migrate JS/TS Code

Replace `import.meta.env.VITE_...` with `runtimeEnv.VITE_...`.

- **Action**: Replace all occurrences.
- **Action**: **CRITICAL**: Remove manual parsing logic.
  - Change `parseInt(import.meta.env.VITE_PORT)` to `runtimeEnv.VITE_PORT`.
  - Change `JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)` to `runtimeEnv.VITE_FIREBASE_CONFIG`.
  - Change `import.meta.env.VITE_ENABLED === 'true'` to `runtimeEnv.VITE_ENABLED`.
- **Action**: Keep `import.meta.env.MODE` and other non-prefixed built-in Vite variables as is.

### 4. Migrate HTML Code

Replace `%VITE_...%` with `<%= runtimeEnv.VITE_... %>`.

- **Action**: Update `index.html`.
- **Action**: Keep `%MODE%` and other non-prefixed built-in Vite variables using the `%` syntax.

## Verification

Before finishing, verify:

- [ ] No occurrences of `import.meta.env.VITE_...` remain in the codebase.
- [ ] No occurrences of `%VITE_...%` remain in `index.html`.
- [ ] All manual parsing logic for environment variables has been removed.
- [ ] `npm run build` (or your updated build script) passes, confirming type safety.
