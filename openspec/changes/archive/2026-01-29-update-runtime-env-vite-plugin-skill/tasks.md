## 1. Implementation

- [x] 1.1 Update `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` with:
  - [x] Default import for `runtimeEnv`.
  - [x] JSON schema example for `.runtimeenvschema.json`.
  - [x] Installation instructions.
  - [x] Migration instructions to use the other rules.
- [x] 1.2 Update `skills/runtime-env-vite-plugin/rules/use-runtime-public-env-in-js-ts.md` to:
  - [x] Simplify: access variables WITH prefix via `runtimeEnv`, and WITHOUT prefix via `import.meta.env`.
- [x] 1.3 Update `skills/runtime-env-vite-plugin/rules/use-runtime-public-env-in-index-html.md` to:
  - [x] Simplify: access variables WITH prefix via `<%= runtimeEnv.VAR %>`, and WITHOUT prefix via native `%VAR%` syntax.
- [x] 1.4 Create `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` with guidance on:
  - [x] Adding to `.runtimeenvschema.json`.
  - [x] Using `object` or `array` types for automatic parsing and type safety.
  - [x] Following "Correct"/"Incorrect" example pattern.
  - [x] Using Firebase config as the example for complex objects.
- [x] 1.4 Update `skills/runtime-env-vite-plugin/SKILL.md` to include all current and new rules.
- [x] 1.5 Update `openspec/specs/agent-skills/spec.md` with the new requirements.
- [x] 1.6 Verify the changes by checking the skill content.

## 2. Validation

- [x] 2.1 Run `openspec validate update-runtime-env-vite-plugin-skill --strict`
