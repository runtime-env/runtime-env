# Change: Update runtime-env-vite-plugin skill

## Why

The current instructions in the `runtime-env-vite-plugin` skill are inaccurate or incomplete:

1. The `.runtimeenvschema.json` is described as a simple key-value pair, but it must be a valid JSON schema.
2. The import of `runtimeEnv` in `vite.config.ts` is shown as a named import, but it is a default export.
3. Installation instructions are missing.
4. The setup instructions should include using the project-specific package manager to install the plugin.
5. The rule for using runtime env in JS/TS doesn't clarify that built-in environment variables (like `import.meta.env.MODE`) should be kept intact.
6. There is no guidance on how to add new environment variables, especially for complex objects and arrays which `runtime-env` can automatically parse and validate if defined correctly in the schema.
7. The `SKILL.md` file is missing the new `add-new-environment-variables` rule.
8. Rules can be simplified: since built-in Vite environment variables (like `MODE`, `DEV`, `PROD`, `BASE_URL`) are NOT prefixed by the user-defined prefix (usually `VITE_`), we can simply state that any variable WITH the prefix must use `runtimeEnv` (using `runtimeEnv.VAR` in JS/TS and `<%= runtimeEnv.VAR %>` in HTML), and those WITHOUT it should stay with Vite's native syntax (`import.meta.env.VAR` in JS/TS and `%VAR%` in HTML).

## What Changes

- Update `openspec/specs/agent-skills/spec.md` to:
  - Clarify that `.runtimeenvschema.json` is a JSON schema.
  - Add a requirement for the setup rule to perform a migration from old code by applying the other rules.
  - Simplify the rule for environment variable access in both JS/TS and HTML: if it has the prefix, use `runtimeEnv` syntax; if not, use native Vite syntax.
  - Add a new requirement for adding new environment variables, guiding towards using proper JSON schema types (object, array) for complex variables.
  - Ensure `SKILL.md` is required to be kept in sync with all defined rules.
- Update `skills/runtime-env-vite-plugin/SKILL.md` to:
  - Include all current and new rules.
- Update `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` to:
  - Fix the `runtimeEnv` import to be a default import.
  - Provide a correct JSON schema example for `.runtimeenvschema.json`.
  - Add installation instructions using the user's package manager.
  - Add instructions to migrate old code by applying the other rules.
- Update `skills/runtime-env-vite-plugin/rules/use-runtime-public-env-in-js-ts.md` to:
  - Simplify: any variable with the prefix MUST use `runtimeEnv`.
  - Explicitly mention that variables WITHOUT the prefix (like `import.meta.env.MODE`) MUST still be accessed via `import.meta.env`.
- Update `skills/runtime-env-vite-plugin/rules/use-runtime-public-env-in-index-html.md` to:
  - Simplify: any variable with the prefix MUST use `<%= runtimeEnv.VAR %>`.
  - Explicitly mention that variables WITHOUT the prefix (like `%MODE%`) MUST still be accessed via native `%VAR%` syntax.
- Create `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` to:
  - Guide agents on how to add new variables to `.runtimeenvschema.json`.
  - Emphasize using `object` or `array` types in the schema for automatic parsing and type safety.
  - Follow the "Correct" and "Incorrect" example pattern.
  - Use a Firebase configuration object as the primary example for complex environment variables.

## Impact

- Affected specs: `agent-skills`
- Affected code: `skills/runtime-env-vite-plugin/rules/*`
