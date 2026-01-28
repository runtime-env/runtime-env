## 1. Specification Updates

- [x] 1.1 Update `openspec/specs/agent-skills/spec.md` to include the requirement for removing Vite-specific environment definitions in the `Setup runtime-env plugin` scenario.

## 2. Skill Updates

- [x] 2.1 Update `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` to add a step for removing existing environment definitions in `src/vite-env.d.ts`.
- [x] 2.2 Add an "Incorrect" example showing the presence of `src/vite-env.d.ts` with custom env definitions alongside `runtime-env`.

## 3. Validation

- [x] 3.1 Run `openspec validate remove-vite-env-definitions-on-setup --strict` to ensure the proposal is valid.
